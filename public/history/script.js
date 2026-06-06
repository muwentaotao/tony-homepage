  /**
   * 历史时间轴 · V3
   * 部署目标：muwentao.com 主站（非 Paperly / zj.muwentao.com）
   *
   * 硬约束：
   * 1. 纯 HTML + CSS + 原生 JavaScript，无框架。
   * 2. 不使用数据库、不使用后端接口。
   * 3. 不使用 Prisma / Supabase / Neon / D1 / Turso。
   * 4. 不使用 Next.js / React / Vue / 大型 UI 库。
   * 5. 数据使用静态 JSON / JS 文件，按需分片加载。
   * 6. 不要一次性加载全部节点（当前 82 个，V3 目标约 200 个，未来世界历史约 600–700 个）。
   * 7. 单板块超过 180 个节点时，需考虑虚拟渲染或分时期加载。
   * 8. 背景图必须压缩为 webp / avif。
   * 9. 移动端减少复杂滤镜和大面积 backdrop-filter。
   *
   * UI 风格：
   * - 静态淡白、黑灰水墨山水背景。
   * - 前景现代半透明卡片、横向时间轴、冷白宣纸感、大圆角、柔和阴影。
   * - 不要开场动画、不要水墨气流、不要渐显动效。
   * - 不要米黄古风、红金国潮、青绿装饰、红印章、金线、厚重博物馆风。
   */
  (function() {
    // ===== 性能辅助函数 =====
    function throttle(fn, wait) {
      var last = 0;
      return function() {
        var now = Date.now();
        if (now - last >= wait) {
          last = now;
          fn.apply(this, arguments);
        }
      };
    }

    function rafThrottle(fn) {
      var ticking = false;
      return function() {
        var args = arguments;
        var ctx = this;
        if (!ticking) {
          requestAnimationFrame(function() {
            ticking = false;
            fn.apply(ctx, args);
          });
          ticking = true;
        }
      };
    }

    function renderDesktopNodes(events, startIndex, batchSize) {
      var fragment = document.createDocumentFragment();
      var end = Math.min(startIndex + batchSize, events.length);
      var isLargeBatch = events.length > 80;
      for (var i = startIndex; i < end; i++) {
        var evt = events[i];
        var importanceClass = evt.importance ? ' importance-' + evt.importance : '';
        var node = document.createElement('div');
        node.className = 'timeline-node' + importanceClass;
        if (!isLargeBatch) {
          node.style.animationDelay = (0.3 + i * 0.07) + 's';
        }
        node.innerHTML =
          '<div class="event-card">' +
            '<div class="event-year">' + evt.dateText + '</div>' +
            '<div class="event-category">' + evt.type + '</div>' +
            '<div class="event-title">' + evt.title + '</div>' +
            '<div class="event-summary">' + evt.summary + '</div>' +
          '</div>' +
          '<div class="node-stem"></div>' +
          '<div class="node-dot"></div>';
        (function(idx) {
          node.addEventListener('click', function() {
            openDetail(idx);
          });
        })(i);
        fragment.appendChild(node);
      }
      timelineEvents.appendChild(fragment);
      if (end < events.length) {
        requestAnimationFrame(function() {
          setTimeout(function() {
            renderDesktopNodes(events, end, batchSize);
          }, 16);
        });
      } else {
        var line = timelineTrack.querySelector('.timeline-line');
        if (line) {
          line.style.width = timelineEvents.scrollWidth + 'px';
          line.style.right = 'auto';
        }
      }
    }

    function renderMobileNodes(events, startIndex, batchSize) {
      var fragment = document.createDocumentFragment();
      var end = Math.min(startIndex + batchSize, events.length);
      var isLargeBatch = events.length > 80;
      for (var i = startIndex; i < end; i++) {
        var evt = events[i];
        var importanceClass = evt.importance ? ' importance-' + evt.importance : '';
        var node = document.createElement('div');
        node.className = 'mobile-flow-node' + importanceClass;
        if (!isLargeBatch) {
          node.style.animationDelay = (0.25 + i * 0.06) + 's';
        }
        node.innerHTML =
          '<div class="mobile-flow-dot"></div>' +
          '<div class="mobile-flow-card">' +
            '<div class="event-year">' + evt.dateText + '</div>' +
            '<div class="event-category">' + evt.type + '</div>' +
            '<div class="event-title">' + evt.title + '</div>' +
            '<div class="event-summary">' + evt.summary + '</div>' +
          '</div>';
        (function(idx) {
          node.addEventListener('click', function() {
            openDetail(idx);
          });
        })(i);
        fragment.appendChild(node);
      }
      mobileFlowEvents.appendChild(fragment);
      if (end < events.length) {
        requestAnimationFrame(function() {
          setTimeout(function() {
            renderMobileNodes(events, end, batchSize);
          }, 16);
        });
      }
    }

    // ===== 导航配置 =====
    var NAV_ITEMS = [
      { key: 'overview', label: '中国历史' },
      { key: 'ancient', label: '古代史' },
      { key: 'modernEarly', label: '近代史' },
      { key: 'modern', label: '现代史' }
    ];

    // ===== 分类配置 =====
    var CATEGORY_CONFIG = [
      { key: 'all', label: '全部' },
      { key: '阶段', label: '阶段' },
      { key: '文明', label: '文明' },
      { key: '思想', label: '思想' },
      { key: '制度', label: '制度' },
      { key: '变法', label: '变法' },
      { key: '交流', label: '交流' },
      { key: '工程', label: '工程' },
      { key: '技术', label: '技术' },
      { key: '航海', label: '航海' },
      { key: '战争', label: '战争' },
      { key: '自强', label: '自强' },
      { key: '革命', label: '革命' },
      { key: '思潮', label: '思潮' },
      { key: '抗战', label: '抗战' },
      { key: '战役', label: '战役' },
      { key: '建国', label: '建国' },
      { key: '改革', label: '改革' },
      { key: '会议', label: '会议' },
      { key: '转型', label: '转型' }
    ];

    // ===== 数据状态（阶段 9：异步分片加载） =====
    var manifest = null;
    var sectionDataMap = {};   // sectionId -> 合并后的板块数据（cards + details）
    var currentSectionData = null;

    // ===== 当前选中板块状态 =====
    var currentSection = null;

    // ===== 当前展开的事件索引 =====
    var currentEventIndex = -1;

    // ===== 滚动到时期标志 =====
    var isScrollingToEra = false;

    // ===== 当前板块时期首事件索引映射 =====
    var currentEraFirstIndexMap = {};

    // ===== 当前选中分类 =====
    var activeCategory = 'all';

    // ===== 当前选中重要性 =====
    var activeImportance = 'all';

    // ===== 当前筛选后的事件列表 =====
    var filteredEvents = [];

    // ===== 当前搜索关键词 =====
    var searchKeyword = '';

    // ===== 全局搜索索引 =====
    var searchIndex = null;
    var searchIndexLoading = false;

    // ===== 搜索 debounce 定时器 =====
    var searchDebounceTimer = null;

    // ===== DOM 引用 =====
    var heroSection = document.getElementById('heroSection');
    var cardsGrid = document.getElementById('cardsGrid');
    var timelineSection = document.getElementById('timelineSection');
    var timelineTitle = document.getElementById('timelineTitle');
    var timelineDesc = document.getElementById('timelineDesc');
    var timelineEras = document.getElementById('timelineEras');
    var timelineEvents = document.getElementById('timelineEvents');
    var timelineTrack = document.getElementById('timelineTrack');
    var timelineNavDesktop = document.getElementById('timelineNavDesktop');
    var mobileCurrentTitle = document.getElementById('mobileCurrentTitle');
    var mobileTabBar = document.getElementById('mobileTabBar');
    var backBtn = document.getElementById('backBtn');
    var mobileBackBtn = document.getElementById('mobileBackBtn');
    var mobileFlowEvents = document.getElementById('mobileFlowEvents');
    var detailOverlay = document.getElementById('detailOverlay');
    var detailBackdrop = document.getElementById('detailBackdrop');
    var detailPanel = document.getElementById('detailPanel');
    var detailClose = document.getElementById('detailClose');
    var detailContent = document.getElementById('detailContent');
    var categoryFilter = document.getElementById('categoryFilter');
    var searchInput = document.getElementById('searchInput');
    var searchClear = document.getElementById('searchClear');
    var searchResultCount = document.getElementById('searchResultCount');
    var inkBg = document.getElementById('inkBg');

    // ===== 加载 manifest =====
    function loadManifest() {
      if (manifest) return Promise.resolve(manifest);
      return fetch('data/manifest.json')
        .then(function(res) {
          if (!res.ok) throw new Error('加载 manifest 失败: ' + res.status);
          return res.json();
        })
        .then(function(data) {
          manifest = data;
          return data;
        });
    }

    // ===== 加载全局搜索索引 =====
    function loadSearchIndex() {
      if (searchIndex) return Promise.resolve(searchIndex);
      if (searchIndexLoading) return Promise.reject(new Error('搜索索引正在加载中'));
      searchIndexLoading = true;
      return fetch('data/search/china-search-index.json')
        .then(function(res) {
          if (!res.ok) throw new Error('加载搜索索引失败: ' + res.status);
          return res.json();
        })
        .then(function(data) {
          searchIndex = data;
          searchIndexLoading = false;
          return data;
        })
        .catch(function(err) {
          searchIndexLoading = false;
          throw err;
        });
    }

    // ===== 全局搜索 =====
    function performGlobalSearch(keyword) {
      if (!searchIndex || !keyword) return [];
      var k = keyword.toLowerCase();
      var results = [];
      for (var i = 0; i < searchIndex.length; i++) {
        var item = searchIndex[i];
        var score = 0;
        if (item.title.toLowerCase().indexOf(k) !== -1) score += 10;
        if (item.summary.toLowerCase().indexOf(k) !== -1) score += 5;
        if (item.dateText.toLowerCase().indexOf(k) !== -1) score += 8;
        if (item.type.toLowerCase().indexOf(k) !== -1) score += 4;
        if (item.eraName.toLowerCase().indexOf(k) !== -1) score += 3;
        if (item.dynasty && item.dynasty.toLowerCase().indexOf(k) !== -1) score += 3;
        for (var t = 0; t < item.tags.length; t++) {
          if (item.tags[t].toLowerCase().indexOf(k) !== -1) {
            score += 6;
            break;
          }
        }
        if (score > 0) {
          results.push({ item: item, score: score });
        }
      }
      results.sort(function(a, b) { return b.score - a.score; });
      return results.slice(0, 8);
    }

    // ===== 加载板块数据（先 cards，后 details 后台加载） =====
    function loadSection(sectionId) {
      if (sectionDataMap[sectionId]) {
        return Promise.resolve(sectionDataMap[sectionId]);
      }
      if (!manifest) {
        return Promise.reject(new Error('Manifest 尚未加载'));
      }
      var meta = null;
      for (var i = 0; i < manifest.sections.length; i++) {
        if (manifest.sections[i].id === sectionId) {
          meta = manifest.sections[i];
          break;
        }
      }
      if (!meta) {
        return Promise.reject(new Error('未找到板块: ' + sectionId));
      }

      return fetch(meta.cardFile)
        .then(function(res) {
          if (!res.ok) throw new Error('加载 cards 失败: ' + res.status);
          return res.json();
        })
        .then(function(cardsData) {
          // 初始化 events 的 detail 为空对象，确保后续搜索不报错
          if (cardsData.events) {
            cardsData.events.forEach(function(evt) {
              if (!evt.type) {
                evt.type = evt.category || '其他';
              }
              evt.detail = { id: evt.id, background: '', content: '', influence: '', whyImportant: '', relatedIds: [] };
            });
          }

          // 开发期数据检查
          if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            validateSectionData(cardsData, sectionId);
          }

          sectionDataMap[sectionId] = cardsData;

          // 后台加载 details，加载完成后合并并重新渲染
          fetch(meta.detailFile)
            .then(function(res) {
              if (!res.ok) throw new Error('加载 details 失败: ' + res.status);
              return res.json();
            })
            .then(function(detailsData) {
              if (cardsData.events) {
                cardsData.events.forEach(function(evt) {
                  var detailObj = detailsData[evt.id];
                  if (typeof detailObj === 'string') {
                    evt.detail = { id: evt.id, background: '', content: detailObj, influence: '', whyImportant: '', relatedIds: [] };
                  } else {
                    evt.detail = detailObj || { id: evt.id, background: '', content: '', influence: '', whyImportant: '', relatedIds: [] };
                  }
                });
              }
              // 如果当前正在显示这个板块，重新渲染以启用详情搜索
              if (currentSection === sectionId) {
                renderTimeline(sectionId);
              }
            })
            .catch(function(err) {
              console.error('加载 details 失败:', err);
            });

          return cardsData;
        });
    }

    // ===== 开发期数据检查 =====
    function validateSectionData(sectionData, sectionId) {
      var validImportance = { 'core': true, 'major': true, 'normal': true };
      var eventIds = {};
      var warnings = [];

      sectionData.events.forEach(function(evt, idx) {
        if (!evt.id) warnings.push('[' + sectionId + '] 事件 #' + idx + ' 缺少 id');
        if (typeof evt.startYear !== 'number') warnings.push('[' + sectionId + '] ' + (evt.id || '#'+idx) + ' startYear 不是数字: ' + evt.startYear);
        if (!validImportance[evt.importance]) warnings.push('[' + sectionId + '] ' + (evt.id || '#'+idx) + ' importance 不合法: ' + evt.importance);
        if (evt.id) eventIds[evt.id] = true;
      });

      sectionData.events.forEach(function(evt) {
        if (evt.relatedIds && Array.isArray(evt.relatedIds)) {
          evt.relatedIds.forEach(function(rid) {
            if (!eventIds[rid]) warnings.push('[' + sectionId + '] ' + evt.id + ' 引用了不存在的 relatedId: ' + rid);
          });
        }
      });

      if (warnings.length > 0) {
        console.warn('=== 数据检查警告 (' + sectionId + ') ===');
        warnings.forEach(function(w) { console.warn(w); });
      }
    }

    // ===== 过滤出有事件的时期 =====
    function getVisibleEras(eras, events) {
      var erasWithEvents = new Set();
      events.forEach(function(evt) {
        erasWithEvents.add(evt.eraName);
      });
      return eras.filter(function(era) {
        return erasWithEvents.has(era);
      });
    }

    // ===== 获取筛选后的事件列表 =====
    function getFilteredEvents(sectionData) {
      var events = sectionData.events;

      if (activeCategory !== 'all') {
        events = events.filter(function(evt) {
          return evt.type === activeCategory;
        });
      }

      if (activeImportance !== 'all') {
        events = events.filter(function(evt) {
          return evt.importance === activeImportance;
        });
      }

      if (searchKeyword) {
        var keyword = searchKeyword.toLowerCase();
        events = events.filter(function(evt) {
          if (evt.dateText.toLowerCase().indexOf(keyword) !== -1) return true;
          if (evt.title.toLowerCase().indexOf(keyword) !== -1) return true;
          if (evt.type.toLowerCase().indexOf(keyword) !== -1) return true;
          if (evt.eraName.toLowerCase().indexOf(keyword) !== -1) return true;
          if (evt.dynasty && evt.dynasty.toLowerCase().indexOf(keyword) !== -1) return true;
          if (evt.summary.toLowerCase().indexOf(keyword) !== -1) return true;
          for (var i = 0; i < evt.tags.length; i++) {
            if (evt.tags[i].toLowerCase().indexOf(keyword) !== -1) return true;
          }
          return false;
        });
      }

      return events;
    }

    // ===== 获取当前板块实际存在的分类列表 =====
    function getVisibleCategories(sectionData) {
      var categories = new Set();
      sectionData.events.forEach(function(evt) {
        categories.add(evt.type);
      });

      var result = ['全部'];
      CATEGORY_CONFIG.forEach(function(cfg) {
        if (cfg.key !== 'all' && categories.has(cfg.key)) {
          result.push(cfg.key);
        }
      });

      categories.forEach(function(cat) {
        var found = false;
        for (var i = 0; i < CATEGORY_CONFIG.length; i++) {
          if (CATEGORY_CONFIG[i].key === cat) {
            found = true;
            break;
          }
        }
        if (!found) {
          result.push(cat);
        }
      });

      return result;
    }

    // ===== 渲染分类筛选按钮 =====
    function renderCategoryFilter(sectionData) {
      categoryFilter.innerHTML = '';

      // Type 筛选
      var typeLabel = document.createElement('span');
      typeLabel.className = 'filter-label';
      typeLabel.textContent = '类型';
      categoryFilter.appendChild(typeLabel);

      var visibleCategories = getVisibleCategories(sectionData);
      visibleCategories.forEach(function(cat, idx) {
        var btn = document.createElement('button');
        var isActive = (cat === '全部' && activeCategory === 'all') || cat === activeCategory;
        btn.className = 'category-btn' + (isActive ? ' active' : '');
        btn.textContent = cat;
        btn.style.animationDelay = (0.05 + idx * 0.03) + 's';
        btn.addEventListener('click', function() {
          activeCategory = (cat === '全部') ? 'all' : cat;
          renderTimeline(currentSection);
          if (filteredEvents.length > 0) {
            setTimeout(function() {
              if (timelineTrack.offsetParent !== null) {
                timelineTrack.scrollTo({ left: 0, behavior: 'smooth' });
              } else {
                var firstNode = mobileFlowEvents.children[0];
                if (firstNode) {
                  firstNode.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }
            }, 100);
          }
        });
        categoryFilter.appendChild(btn);
      });

      // Importance 筛选
      var impLabel = document.createElement('span');
      impLabel.className = 'filter-label';
      impLabel.textContent = '重要性';
      impLabel.style.marginLeft = '16px';
      categoryFilter.appendChild(impLabel);

      var importanceOptions = [
        { key: 'all', label: '全部' },
        { key: 'core', label: '核心' },
        { key: 'major', label: '重要' },
        { key: 'normal', label: '普通' }
      ];
      importanceOptions.forEach(function(opt, idx) {
        var btn = document.createElement('button');
        var isActive = opt.key === activeImportance;
        btn.className = 'category-btn importance-btn' + (isActive ? ' active' : '');
        btn.textContent = opt.label;
        btn.style.animationDelay = (0.2 + idx * 0.03) + 's';
        btn.addEventListener('click', function() {
          activeImportance = opt.key;
          renderTimeline(currentSection);
          if (filteredEvents.length > 0) {
            setTimeout(function() {
              if (timelineTrack.offsetParent !== null) {
                timelineTrack.scrollTo({ left: 0, behavior: 'smooth' });
              } else {
                var firstNode = mobileFlowEvents.children[0];
                if (firstNode) {
                  firstNode.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }
            }, 100);
          }
        });
        categoryFilter.appendChild(btn);
      });
    }

    // ===== 根据滚动位置自动高亮当前时期按钮（桌面端） =====
    function updateActiveEraRaw() {
      if (isScrollingToEra) return;
      if (!currentSectionData || !timelineEvents.children.length || filteredEvents.length === 0) return;

      var trackCenter = timelineTrack.scrollLeft + timelineTrack.clientWidth / 2;
      var closestIdx = 0;
      var closestDist = Infinity;

      var nodes = timelineEvents.children;
      for (var i = 0; i < nodes.length; i++) {
        var nodeCenter = nodes[i].offsetLeft + nodes[i].offsetWidth / 2;
        var dist = Math.abs(nodeCenter - trackCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = i;
        }
      }

      var currentEra = filteredEvents[closestIdx].eraName;
      var eraBtns = timelineEras.querySelectorAll('.era-btn');
      eraBtns.forEach(function(btn) {
        if (btn.textContent === currentEra) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
    var updateActiveEra = rafThrottle(updateActiveEraRaw);

    // ===== 滚动到指定时期的首个事件 =====
    function scrollToEra(era) {
      var firstIdx = currentEraFirstIndexMap[era];
      if (firstIdx === undefined) return;

      // 桌面端：滚动横向轨道
      var node = timelineEvents.children[firstIdx];
      if (node && timelineTrack.offsetParent !== null) {
        isScrollingToEra = true;
        var nodeLeft = node.offsetLeft;
        var trackWidth = timelineTrack.clientWidth;
        var nodeWidth = node.offsetWidth;
        var scrollTarget = nodeLeft - (trackWidth / 2) + (nodeWidth / 2);
        timelineTrack.scrollTo({ left: Math.max(0, scrollTarget), behavior: 'smooth' });

        var eraBtns = timelineEras.querySelectorAll('.era-btn');
        eraBtns.forEach(function(btn) {
          btn.classList.toggle('active', btn.textContent === era);
        });

        setTimeout(function() {
          isScrollingToEra = false;
          updateActiveEra();
        }, 500);
        return;
      }

      // 移动端：滚动竖向流到对应事件
      var mobileNode = mobileFlowEvents.children[firstIdx];
      if (mobileNode) {
        var eraBtns = timelineEras.querySelectorAll('.era-btn');
        eraBtns.forEach(function(btn) {
          btn.classList.toggle('active', btn.textContent === era);
        });
        mobileNode.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // ===== 打开详情面板 =====
    function openDetail(index) {
      if (!currentSectionData) return;
      var evt = filteredEvents[index];
      if (!evt) return;

      currentEventIndex = index;

      var tagsHtml = '';
      if (evt.tags && evt.tags.length > 0) {
        tagsHtml = '<div class="detail-tags">' +
          evt.tags.map(function(t) { return '<span class="detail-tag">' + t + '</span>'; }).join('') +
          '</div>';
      }

      var detail = evt.detail || {};
      var detailSectionsHtml = '';
      if (detail.background) {
        detailSectionsHtml += '<div class="detail-section"><h4 class="detail-section-title">背景</h4><p class="detail-body">' + detail.background + '</p></div>';
      }
      if (detail.content) {
        detailSectionsHtml += '<div class="detail-section"><h4 class="detail-section-title">经过</h4><p class="detail-body">' + detail.content + '</p></div>';
      }
      if (detail.influence) {
        detailSectionsHtml += '<div class="detail-section"><h4 class="detail-section-title">影响</h4><p class="detail-body">' + detail.influence + '</p></div>';
      }
      if (detail.whyImportant) {
        detailSectionsHtml += '<div class="detail-section"><h4 class="detail-section-title">为什么重要</h4><p class="detail-body">' + detail.whyImportant + '</p></div>';
      }

      detailContent.innerHTML =
        '<div class="detail-header">' +
          '<div class="detail-year">' + evt.dateText + '</div>' +
          '<div class="detail-meta">' +
            '<span class="detail-category">' + evt.type + '</span>' +
            '<span class="detail-era">' + evt.eraName + '</span>' +
          '</div>' +
        '</div>' +
        '<h3 class="detail-title">' + evt.title + '</h3>' +
        '<p class="detail-summary">' + evt.summary + '</p>' +
        '<div class="detail-divider"></div>' +
        detailSectionsHtml +
        tagsHtml;

      var nodes = timelineEvents.querySelectorAll('.timeline-node');
      nodes.forEach(function(node, i) {
        node.classList.toggle('active', i === index);
      });

      var mobileNodes = mobileFlowEvents.querySelectorAll('.mobile-flow-node');
      mobileNodes.forEach(function(node, i) {
        node.classList.toggle('active', i === index);
      });

      detailOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    // ===== 关闭详情面板 =====
    function closeDetail() {
      detailOverlay.classList.remove('open');
      document.body.style.overflow = '';

      var nodes = timelineEvents.querySelectorAll('.timeline-node');
      nodes.forEach(function(node) {
        node.classList.remove('active');
      });

      var mobileNodes = mobileFlowEvents.querySelectorAll('.mobile-flow-node');
      mobileNodes.forEach(function(node) {
        node.classList.remove('active');
      });

      currentEventIndex = -1;
    }

    // ===== 渲染导航高亮 =====
    function renderNav() {
      timelineNavDesktop.innerHTML = '';
      NAV_ITEMS.forEach(function(item) {
        var btn = document.createElement('button');
        btn.className = 'nav-btn' + (item.key === currentSection ? ' active' : '');
        btn.textContent = item.label;
        btn.addEventListener('click', function() {
          switchSection(item.key);
        });
        timelineNavDesktop.appendChild(btn);
      });

      if (currentSectionData) {
        mobileCurrentTitle.textContent = currentSectionData.title;
      }

      mobileTabBar.innerHTML = '';
      NAV_ITEMS.forEach(function(item) {
        var btn = document.createElement('button');
        btn.className = 'mobile-nav-btn' + (item.key === currentSection ? ' active' : '');
        btn.textContent = item.label;
        btn.addEventListener('click', function() {
          switchSection(item.key);
        });
        mobileTabBar.appendChild(btn);
      });
    }

    // ===== 渲染时间轴内容 =====
    function renderTimeline(key) {
      var sectionData = sectionDataMap[key];
      if (!sectionData) return;

      timelineTitle.textContent = sectionData.title;
      timelineDesc.textContent = sectionData.desc;

      filteredEvents = getFilteredEvents(sectionData);

      if (searchKeyword) {
        if (filteredEvents.length > 0) {
          searchResultCount.textContent = '找到 ' + filteredEvents.length + ' 个节点';
        } else {
          searchResultCount.textContent = '未找到相关节点';
          // 尝试全局搜索其他板块
          if (!searchIndex) {
            loadSearchIndex().then(function() {
              if (currentSection && searchKeyword) {
                renderTimeline(currentSection);
              }
            }).catch(function() {});
          }
        }
      } else {
        searchResultCount.textContent = '';
      }

      renderCategoryFilter(sectionData);

      var visibleEras = getVisibleEras(sectionData.eras, filteredEvents);
      timelineEras.innerHTML = '';
      visibleEras.forEach(function(era, idx) {
        var btn = document.createElement('button');
        btn.className = 'era-btn' + (idx === 0 ? ' active' : '');
        btn.textContent = era;
        btn.style.animationDelay = (0.15 + idx * 0.05) + 's';
        btn.addEventListener('click', function() {
          scrollToEra(era);
        });
        timelineEras.appendChild(btn);
      });

      currentEraFirstIndexMap = {};
      filteredEvents.forEach(function(evt, idx) {
        if (currentEraFirstIndexMap[evt.eraName] === undefined) {
          currentEraFirstIndexMap[evt.eraName] = idx;
        }
      });

      // 桌面端横向事件
      timelineEvents.innerHTML = '';
      if (filteredEvents.length === 0) {
        var emptyHtml = '<div class="timeline-empty">当前筛选下暂无节点</div>';
        if (searchKeyword && searchIndex) {
          var globalResults = performGlobalSearch(searchKeyword);
          if (globalResults.length > 0) {
            emptyHtml += '<div class="global-search-hint">其他板块找到以下结果：</div>';
            emptyHtml += '<div class="global-search-results">';
            for (var gi = 0; gi < globalResults.length; gi++) {
              var gr = globalResults[gi].item;
              var sectionName = '';
              for (var si = 0; si < manifest.sections.length; si++) {
                if (manifest.sections[si].id === gr.sectionId) {
                  sectionName = manifest.sections[si].title;
                  break;
                }
              }
              emptyHtml += '<div class="global-search-result-item" data-section="' + gr.sectionId + '" data-event="' + gr.eventId + '">' +
                '<span class="global-result-date">' + gr.dateText + '</span>' +
                '<span class="global-result-title">' + gr.title + '</span>' +
                '<span class="global-result-section">' + sectionName + '</span>' +
              '</div>';
            }
            emptyHtml += '</div>';
          }
        }
        timelineEvents.innerHTML = emptyHtml;
        // 绑定全局搜索结果点击
        var resultItems = timelineEvents.querySelectorAll('.global-search-result-item');
        for (var ri = 0; ri < resultItems.length; ri++) {
          resultItems[ri].addEventListener('click', function() {
            var targetSection = this.getAttribute('data-section');
            var targetEvent = this.getAttribute('data-event');
            if (targetSection && targetEvent) {
              activeCategory = 'all';
              activeImportance = 'all';
              switchSection(targetSection);
              // 等待渲染完成后定位到目标事件
              var checkInterval = setInterval(function() {
                if (currentSection === targetSection && filteredEvents.length > 0) {
                  clearInterval(checkInterval);
                  for (var fi = 0; fi < filteredEvents.length; fi++) {
                    if (filteredEvents[fi].id === targetEvent) {
                      openDetail(fi);
                      break;
                    }
                  }
                }
              }, 100);
              setTimeout(function() { clearInterval(checkInterval); }, 5000);
            }
          });
        }
      } else {
        if (filteredEvents.length <= 50) {
          renderDesktopNodes(filteredEvents, 0, 50);
        } else {
          renderDesktopNodes(filteredEvents, 0, 30);
        }
      }

      // 移动端竖向事件流
      mobileFlowEvents.innerHTML = '';
      if (filteredEvents.length === 0) {
        var mobileEmptyHtml = '<div class="timeline-empty">当前筛选下暂无节点</div>';
        if (searchKeyword && searchIndex) {
          var globalResultsM = performGlobalSearch(searchKeyword);
          if (globalResultsM.length > 0) {
            mobileEmptyHtml += '<div class="global-search-hint">其他板块找到以下结果：</div>';
            mobileEmptyHtml += '<div class="global-search-results">';
            for (var gim = 0; gim < globalResultsM.length; gim++) {
              var grm = globalResultsM[gim].item;
              var sectionNameM = '';
              for (var sim = 0; sim < manifest.sections.length; sim++) {
                if (manifest.sections[sim].id === grm.sectionId) {
                  sectionNameM = manifest.sections[sim].title;
                  break;
                }
              }
              mobileEmptyHtml += '<div class="global-search-result-item" data-section="' + grm.sectionId + '" data-event="' + grm.eventId + '">' +
                '<span class="global-result-date">' + grm.dateText + '</span>' +
                '<span class="global-result-title">' + grm.title + '</span>' +
                '<span class="global-result-section">' + sectionNameM + '</span>' +
              '</div>';
            }
            mobileEmptyHtml += '</div>';
          }
        }
        mobileFlowEvents.innerHTML = mobileEmptyHtml;
        var resultItemsM = mobileFlowEvents.querySelectorAll('.global-search-result-item');
        for (var rim = 0; rim < resultItemsM.length; rim++) {
          resultItemsM[rim].addEventListener('click', function() {
            var targetSection = this.getAttribute('data-section');
            var targetEvent = this.getAttribute('data-event');
            if (targetSection && targetEvent) {
              activeCategory = 'all';
              activeImportance = 'all';
              switchSection(targetSection);
              var checkIntervalM = setInterval(function() {
                if (currentSection === targetSection && filteredEvents.length > 0) {
                  clearInterval(checkIntervalM);
                  for (var fim = 0; fim < filteredEvents.length; fim++) {
                    if (filteredEvents[fim].id === targetEvent) {
                      openDetail(fim);
                      break;
                    }
                  }
                }
              }, 100);
              setTimeout(function() { clearInterval(checkIntervalM); }, 5000);
            }
          });
        }
      } else {
        if (filteredEvents.length <= 50) {
          renderMobileNodes(filteredEvents, 0, 50);
        } else {
          renderMobileNodes(filteredEvents, 0, 30);
        }
      }

    }

    // ===== 在时间轴区域内切换板块 =====
    function switchSection(key) {
      if (key === currentSection) return;

      closeDetail();

      timelineEvents.classList.add('switching');
      mobileFlowEvents.classList.add('switching');

      var startTime = Date.now();

      loadManifest().then(function() {
        return loadSection(key);
      }).then(function(sectionData) {
        var elapsed = Date.now() - startTime;
        var delay = Math.max(0, 300 - elapsed);

        setTimeout(function() {
          currentSection = key;
          currentSectionData = sectionData;
          activeCategory = 'all';
          searchKeyword = '';
          searchInput.value = '';
          searchClear.classList.remove('visible');
          searchResultCount.textContent = '';
          renderTimeline(key);
          renderNav();
          timelineTrack.scrollLeft = 0;

          timelineEvents.classList.remove('switching');
          mobileFlowEvents.classList.remove('switching');

          updateActiveEra();

          // 移动端滚动到时间轴区域顶部
          if (window.innerWidth <= 768) {
            var offset = timelineSection.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
          }
        }, delay);
      }).catch(function(err) {
        var elapsed = Date.now() - startTime;
        var delay = Math.max(0, 300 - elapsed);
        setTimeout(function() {
          timelineEvents.classList.remove('switching');
          mobileFlowEvents.classList.remove('switching');
          timelineTitle.textContent = '加载失败';
          timelineDesc.textContent = '请检查网络连接后刷新重试';
          timelineEvents.innerHTML = '<div class="timeline-empty">数据加载失败，请稍后重试</div>';
          mobileFlowEvents.innerHTML = '<div class="timeline-empty">数据加载失败，请稍后重试</div>';
        }, delay);
        console.error(err);
      });
    }

    // ===== 显示时间轴视图 =====
    function showTimeline(key) {
      currentSection = key;
      activeCategory = 'all';
      activeImportance = 'all';
      searchKeyword = '';
      searchInput.value = '';
      searchClear.classList.remove('visible');
      searchResultCount.textContent = '';

      if (inkBg) {
        inkBg.classList.remove('home');
        inkBg.classList.add('china');
      }

      heroSection.classList.add('compact');
      cardsGrid.classList.add('hidden');

      timelineSection.style.display = 'block';
      void timelineSection.offsetWidth;
      timelineSection.classList.add('visible');

      // 显示加载状态
      timelineTitle.textContent = '加载中...';
      timelineDesc.textContent = '';
      timelineEvents.innerHTML = '<div class="timeline-empty">正在加载数据...</div>';
      mobileFlowEvents.innerHTML = '<div class="timeline-empty">正在加载数据...</div>';
      categoryFilter.innerHTML = '';
      timelineEras.innerHTML = '';

      loadManifest().then(function() {
        return loadSection(key);
      }).then(function(sectionData) {
        currentSectionData = sectionData;
        renderTimeline(key);
        renderNav();
      }).catch(function(err) {
        timelineTitle.textContent = '加载失败';
        timelineDesc.textContent = '请检查网络连接后刷新重试';
        timelineEvents.innerHTML = '<div class="timeline-empty">数据加载失败，请稍后重试</div>';
        mobileFlowEvents.innerHTML = '<div class="timeline-empty">数据加载失败，请稍后重试</div>';
        console.error(err);
      });
    }

    // ===== 返回首页 =====
    function showHome() {
      closeDetail();
      currentSection = null;
      currentSectionData = null;
      activeCategory = 'all';
      filteredEvents = [];
      searchKeyword = '';
      searchInput.value = '';
      searchClear.classList.remove('visible');
      searchResultCount.textContent = '';

      if (inkBg) {
        inkBg.classList.remove('china');
        inkBg.classList.add('home');
      }

      timelineSection.classList.remove('visible');

      setTimeout(function() {
        timelineSection.style.display = 'none';
        timelineNavDesktop.innerHTML = '';
        mobileTabBar.innerHTML = '';
        mobileCurrentTitle.textContent = '';
        categoryFilter.innerHTML = '';
        timelineEras.innerHTML = '';
        searchResultCount.textContent = '';
        heroSection.classList.remove('compact');
        cardsGrid.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 800);
    }

    // ===== 初始化桌面端横向交互 =====
    function initDesktopInteraction() {
      timelineTrack.addEventListener('wheel', throttle(function(e) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          var newScrollLeft = timelineTrack.scrollLeft + e.deltaY * 0.6;
          timelineTrack.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
        }
      }, 80), { passive: false });

      var isDragging = false;
      var startX = 0;
      var startScrollLeft = 0;

      timelineTrack.addEventListener('mousedown', function(e) {
        isDragging = true;
        timelineTrack.style.cursor = 'grabbing';
        startX = e.pageX - timelineTrack.offsetLeft;
        startScrollLeft = timelineTrack.scrollLeft;
      });

      timelineTrack.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
        var x = e.pageX - timelineTrack.offsetLeft;
        var walk = (x - startX) * 1.2;
        timelineTrack.scrollLeft = startScrollLeft - walk;
      });

      document.addEventListener('mouseup', function() {
        if (isDragging) {
          isDragging = false;
          timelineTrack.style.cursor = 'grab';
        }
      });

      timelineTrack.addEventListener('touchstart', function(e) {
        isDragging = true;
        startX = e.touches[0].pageX - timelineTrack.offsetLeft;
        startScrollLeft = timelineTrack.scrollLeft;
      }, { passive: true });

      timelineTrack.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        var x = e.touches[0].pageX - timelineTrack.offsetLeft;
        var walk = (x - startX) * 1.2;
        timelineTrack.scrollLeft = startScrollLeft - walk;
      }, { passive: true });

      timelineTrack.addEventListener('touchend', function() {
        isDragging = false;
      });

      timelineTrack.addEventListener('scroll', function() {
        if (isScrollingToEra) return;
        updateActiveEra();
      });
    }

    // ===== 初始化详情面板交互 =====
    function initDetailPanel() {
      detailClose.addEventListener('click', closeDetail);
      detailBackdrop.addEventListener('click', closeDetail);

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && detailOverlay.classList.contains('open')) {
          closeDetail();
        }
      });

      detailPanel.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    }

    // ===== 初始化搜索交互 =====
    function initSearch() {
      searchInput.addEventListener('input', function() {
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(function() {
          var value = searchInput.value.trim();
          searchKeyword = value;
          if (value) {
            searchClear.classList.add('visible');
          } else {
            searchClear.classList.remove('visible');
          }
          if (currentSection) {
            renderTimeline(currentSection);
            if (filteredEvents.length > 0) {
              setTimeout(function() {
                if (timelineTrack.offsetParent !== null) {
                  timelineTrack.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                  var firstNode = mobileFlowEvents.children[0];
                  if (firstNode) {
                    firstNode.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }
              }, 100);
            }
          }
        }, 250);
      });

      searchClear.addEventListener('click', function() {
        searchInput.value = '';
        searchKeyword = '';
        searchClear.classList.remove('visible');
        if (currentSection) {
          renderTimeline(currentSection);
        }
        searchInput.focus();
      });
    }

    // ===== 初始化卡片点击 =====
    function initCards() {
      var cards = document.querySelectorAll('.entry-card');
      cards.forEach(function(card) {
        card.addEventListener('click', function() {
          var key = this.getAttribute('data-key');
          showTimeline(key);
        });
      });
    }

    // ===== 首页说明展开/收起 =====
    function initAboutToggle() {
      var aboutToggle = document.getElementById('aboutToggle');
      var aboutBody = document.getElementById('aboutBody');
      if (!aboutToggle || !aboutBody) return;
      aboutToggle.setAttribute('aria-expanded', 'false');
      aboutToggle.setAttribute('aria-label', '展开说明');
      aboutToggle.addEventListener('click', function() {
        var isOpen = aboutBody.classList.contains('open');
        if (isOpen) {
          aboutBody.classList.remove('open');
          aboutToggle.setAttribute('aria-expanded', 'false');
          aboutToggle.setAttribute('aria-label', '展开说明');
        } else {
          aboutBody.classList.add('open');
          aboutToggle.setAttribute('aria-expanded', 'true');
          aboutToggle.setAttribute('aria-label', '收起说明');
        }
      });
    }

    // ===== 返回按钮 =====
    backBtn.addEventListener('click', function() {
      window.location.href = '/';
    });
    mobileBackBtn.addEventListener('click', function() {
      window.location.href = '/';
    });

    // ===== 启动 =====
    document.addEventListener('DOMContentLoaded', function() {
      initCards();
      initAboutToggle();
      initDesktopInteraction();
      initDetailPanel();
      initSearch();
      // 预加载 manifest，为后续板块切换做准备
      loadManifest().catch(function(err) {
        console.error('预加载 manifest 失败:', err);
      });
    });
  })();
