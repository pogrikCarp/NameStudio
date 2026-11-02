import { useEffect } from 'react';

const METRIKA_ID = 114000150;

function reachGoal(name, params = {}) {
  if (typeof window.ym !== 'function') return;
  window.ym(METRIKA_ID, 'reachGoal', name, params);
}

function getPlacement(element) {
  const section = element.closest('section[id]');
  if (section?.id) return section.id;
  if (element.closest('.site-header')) return 'header';
  if (element.closest('.site-footer')) return 'footer';
  return 'unknown';
}

export default function useAnalytics() {
  useEffect(() => {
    const sentScrollGoals = new Set();

    const handleClick = (event) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest('a');
      if (!link) return;

      const href = link.href;
      const placement = getPlacement(link);
      const label = link.textContent?.trim().replace(/\s+/g, ' ').slice(0, 120) || 'link';

      if (href.includes('t.me/name_manager')) {
        const params = { placement, label };
        reachGoal('telegram_click', params);

        if (['header', 'hero', 'audit', 'contact', 'footer'].includes(placement)) {
          reachGoal('audit_click', params);
        }

        if (placement === 'services') {
          reachGoal('service_cta_click', params);
        }
      }

      if (placement === 'projects' && link.target === '_blank') {
        reachGoal('project_click', { placement, label, url: href });
      }
    };

    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const depth = Math.round((window.scrollY / scrollable) * 100);
      [50, 90].forEach((threshold) => {
        if (depth >= threshold && !sentScrollGoals.has(threshold)) {
          sentScrollGoals.add(threshold);
          reachGoal(`scroll_${threshold}`);
        }
      });
    };

    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
}
