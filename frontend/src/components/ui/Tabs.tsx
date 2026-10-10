import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'underline' | 'pill';
  className?: string;
  style?: React.CSSProperties;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  className = '',
  style,
}) => {
  return (
    <div
      role="tablist"
      className={`atlas-tabs atlas-tabs-${variant} ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: variant === 'pill' ? '0.35rem' : '1.5rem',
        borderBottom: variant === 'underline' ? '1px solid var(--color-border)' : 'none',
        backgroundColor: variant === 'pill' ? 'var(--color-card-muted)' : 'transparent',
        padding: variant === 'pill' ? '0.25rem' : '0',
        borderRadius: variant === 'pill' ? 'var(--radius-sm)' : '0',
        width: 'fit-content',
        maxWidth: '100%',
        overflowX: 'auto',
        ...style,
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        if (variant === 'pill') {
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => onChange(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.85rem',
                fontSize: 'var(--text-sm)',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#FFFFFF' : 'var(--color-ink-secondary)',
                backgroundColor: isActive ? 'var(--color-blue-ink)' : 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  style={{
                    fontSize: 'var(--text-xs)',
                    padding: '0.1rem 0.4rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'var(--color-border-light)',
                    color: isActive ? '#FFFFFF' : 'var(--color-ink-muted)',
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onChange(tab.id)}
            className="atlas-tab-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.65rem 0.35rem',
              fontSize: 'var(--text-sm)',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? 'var(--color-terracotta)' : 'var(--color-ink-secondary)',
              backgroundColor: 'transparent',
              border: 'none',
              marginBottom: '-1px',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              whiteSpace: 'nowrap',
              position: 'relative',
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  padding: '0.1rem 0.45rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isActive ? 'var(--color-terracotta-soft)' : 'var(--color-card-muted)',
                  color: isActive ? 'var(--color-terracotta)' : 'var(--color-ink-muted)',
                  border: '1px solid var(--color-border-light)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {tab.badge}
              </span>
            )}
            {/* Indicador deslizante inferior animado con scaleX */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '2px',
                backgroundColor: 'var(--color-terracotta)',
                transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: 'center',
                transition: 'transform 240ms var(--motion-ease-out)',
              }}
            />
          </button>
        );
      })}
    </div>
  );
};
