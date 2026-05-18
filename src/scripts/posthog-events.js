// BloomPath Blog - PostHog Custom Event Tracking

document.addEventListener('DOMContentLoaded', () => {
  if (typeof posthog === 'undefined') return;

  // 1. Article Read Tracking (scroll to 25%, 50%, 75%, 100%)
  const article = document.querySelector('article') || document.querySelector('.post-content');
  if (article) {
    const milestones = [25, 50, 75, 100];
    const fired = new Set();

    window.addEventListener('scroll', () => {
      const rect = article.getBoundingClientRect();
      const articleTop = rect.top + window.scrollY;
      const articleHeight = rect.height;
      const scrollPos = window.scrollY + window.innerHeight;
      const progress = Math.min(100, Math.round(((scrollPos - articleTop) / articleHeight) * 100));

      milestones.forEach(m => {
        if (progress >= m && !fired.has(m)) {
          fired.add(m);
          posthog.capture('blog_scroll_depth', {
            depth: m,
            path: window.location.pathname,
            title: document.title
          });
        }
      });
    });
  }

  // 2. Affiliate Link Click Tracking (search entire page, not just .post-content)
  document.querySelectorAll('a[href*="amazon.com"], a[href*="tag=bloompath"], a[href*="amzn.to"]').forEach(link => {
    link.addEventListener('click', () => {
      posthog.capture('affiliate_link_click', {
        url: link.href,
        text: link.textContent.trim().substring(0, 100),
        path: window.location.pathname
      });
    });
  });

  // 3. App Download Click Tracking (include bloompath.quakr.dev + bloom-path.app links)
  document.querySelectorAll('a[href*="apps.apple.com"], a[href*="play.google.com"], a[href*="app-store"], a[href*="bloompath.quakr.dev"], .app-download, .mid-cta-btn, .app-banner-cta').forEach(link => {
    link.addEventListener('click', () => {
      posthog.capture('app_download_click', {
        url: link.href || '',
        text: link.textContent.trim().substring(0, 100),
        path: window.location.pathname
      });
    });
  });

  // 4. Newsletter Signup Tracking (forms + any beehiiv embed)
  document.querySelectorAll('form[action*="beehiiv"], form[action*="subscribe"], .newsletter-form, form[data-beehiiv]').forEach(form => {
    form.addEventListener('submit', () => {
      posthog.capture('newsletter_signup', {
        path: window.location.pathname
      });
    });
  });
  // Also track clicks on any beehiiv subscribe button
  document.querySelectorAll('a[href*="beehiiv"], button[class*="subscribe"], input[type="submit"][value*="ubscri"]').forEach(btn => {
    btn.addEventListener('click', () => {
      posthog.capture('newsletter_signup', {
        path: window.location.pathname,
        method: 'button_click'
      });
    });
  });

  // 5. Internal Link Click Tracking (search entire page for internal links)
  document.querySelectorAll('a[href^="/"], a[href*="bloom-path.app"]').forEach(link => {
    // Exclude affiliate, external, and nav links
    if (link.href.includes('amazon') || link.href.includes('apps.apple') || link.href.includes('bloompath.quakr.dev')) return;
    if (link.closest('header') || link.closest('footer') || link.closest('nav')) return;
    link.addEventListener('click', () => {
      posthog.capture('internal_link_click', {
        from: window.location.pathname,
        to: link.getAttribute('href'),
        text: link.textContent.trim().substring(0, 100)
      });
    });
  });

  // 6. Share Button Click Tracking
  document.querySelectorAll('.share-btn, [class*="share"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const platform = btn.getAttribute('aria-label') || btn.textContent.trim();
      posthog.capture('share_button_click', {
        platform: platform.substring(0, 50),
        path: window.location.pathname
      });
    });
  });

  // 7. Topic Page View Tracking
  if (window.location.pathname.includes('/topics/')) {
    const topic = window.location.pathname.split('/topics/')[1]?.replace('/', '');
    posthog.capture('topic_page_view', {
      topic: topic,
      lang: window.location.pathname.startsWith('/zh') ? 'zh' : 'en'
    });
  }

  // 8. Time on Page Tracking (30s, 60s, 120s, 300s)
  const timeMarks = [30, 60, 120, 300];
  const timeFired = new Set();
  const startTime = Date.now();

  setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timeMarks.forEach(t => {
      if (elapsed >= t && !timeFired.has(t)) {
        timeFired.add(t);
        posthog.capture('time_on_page', {
          seconds: t,
          path: window.location.pathname
        });
      }
    });
  }, 5000);
});
