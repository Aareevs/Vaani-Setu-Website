import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'motion/react';
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: 'chevron' | 'slash' | 'dot';
  className?: string;
  darkMode?: boolean;
}

export function Breadcrumb({ items, separator = 'chevron', className, darkMode }: BreadcrumbProps) {
  const SeparatorIcon = () => {
    switch (separator) {
      case 'slash':
        return <span className="text-gray-400">/</span>;
      case 'dot':
        return <span className="text-gray-400">•</span>;
      case 'chevron':
      default:
        return <ChevronRight className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <nav 
      className={cn("flex items-center space-x-2 text-sm", className)}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isClickable = item.href || item.onClick;

          return (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-2"
            >
              {index > 0 && <SeparatorIcon />}
              
              {isClickable ? (
                <button
                  onClick={item.onClick || (item.href ? () => window.location.href = item.href! : undefined)}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                    darkMode 
                      ? "text-gray-300 hover:text-white hover:bg-gray-700" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                    isLast && "font-medium text-gray-900 dark:text-white cursor-default"
                  )}
                  disabled={isLast}
                  aria-current={isLast ? 'page' : undefined}
                  aria-label={isLast ? `Current page: ${item.label}` : `Go to ${item.label}`}
                >
                  {index === 0 && (
                    <Home className="w-4 h-4" aria-hidden="true" />
                  )}
                  <span>{item.label}</span>
                </button>
              ) : (
                <span
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-md",
                    darkMode ? "text-white" : "text-gray-900",
                    "font-medium"
                  )}
                  aria-current="page"
                >
                  {index === 0 && (
                    <Home className="w-4 h-4" aria-hidden="true" />
                  )}
                  <span>{item.label}</span>
                </span>
              )}
            </motion.li>
          );
        })}
      </ol>
    </nav>
  );
}

// Utility function to generate breadcrumb items from page names
export function generateBreadcrumbs(currentPage: string, onNavigate: (page: string) => void): BreadcrumbItem[] {
  const pageLabels: Record<string, string> = {
    'home': 'Home',
    'dashboard': 'Dashboard',
    'interpreter': 'Interpreter',
    'community': 'Community',
    'tutorials': 'Tutorials',
    'profile': 'Profile',
    'settings': 'Settings',
    'pricing': 'Pricing',
    'about': 'About',
    'login': 'Login',
    'signup': 'Sign Up'
  };

  const items: BreadcrumbItem[] = [
    { 
      label: 'Home', 
      onClick: () => onNavigate('home'),
      href: '#'
    }
  ];

  // Add current page if it's not home
  if (currentPage !== 'home' && pageLabels[currentPage]) {
    items.push({
      label: pageLabels[currentPage],
      onClick: () => onNavigate(currentPage)
    });
  }

  return items;
}

// Enhanced breadcrumb with sub-navigation support
interface EnhancedBreadcrumbProps extends BreadcrumbProps {
  subPage?: string;
  subPageLabel?: string;
}

export function EnhancedBreadcrumb({ 
  items, 
  subPage, 
  subPageLabel, 
  ...props 
}: EnhancedBreadcrumbProps) {
  const enhancedItems = [...items];
  
  if (subPage && subPageLabel) {
    enhancedItems.push({
      label: subPageLabel,
      onClick: subPage ? () => {} : undefined // No navigation for sub-pages
    });
  }

  return <Breadcrumb items={enhancedItems} {...props} />;
}
