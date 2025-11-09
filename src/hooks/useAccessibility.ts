import { useEffect } from 'react';

// Hook for managing keyboard navigation
export function useKeyboardNavigation() {
  // Global keyboard navigation setup
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if user is typing in an input field
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
        return;
      }

      // Global keyboard shortcuts
      switch (event.key) {
        case 'Escape':
          // Close any open modals, dropdowns, etc.
          document.dispatchEvent(new CustomEvent('escape-pressed'));
          break;
        
        case 'Tab':
          // Ensure focus is visible
          document.body.classList.add('keyboard-navigation');
          break;
      }
    };

    const handleMouseDown = () => {
      // Remove keyboard navigation class when mouse is used
      document.body.classList.remove('keyboard-navigation');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Return a function for handling specific keyboard navigation events
  return (e: React.KeyboardEvent, options: {
    onEnter?: () => void;
    onSpace?: () => void;
    onArrowRight?: () => void;
    onArrowLeft?: () => void;
  }) => {
    switch (e.key) {
      case 'Enter':
        if (options.onEnter) {
          e.preventDefault();
          options.onEnter();
        }
        break;
      case ' ':
        if (options.onSpace) {
          e.preventDefault();
          options.onSpace();
        }
        break;
      case 'ArrowRight':
        if (options.onArrowRight) {
          e.preventDefault();
          options.onArrowRight();
        }
        break;
      case 'ArrowLeft':
        if (options.onArrowLeft) {
          e.preventDefault();
          options.onArrowLeft();
        }
        break;
    }
  };
}

// Hook for managing focus management
export function useFocusManagement() {
  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstFocusableElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  };

  return { trapFocus };
}

// Hook for announcing changes to screen readers
export function useAnnouncer() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcer = document.getElementById('announcer') || createAnnouncer();
    announcer.setAttribute('aria-live', priority);
    announcer.textContent = message;
    
    // Clear the message after a delay to prevent it from being re-announced
    setTimeout(() => {
      if (announcer.textContent === message) {
        announcer.textContent = '';
      }
    }, 1000);
  };

  const createAnnouncer = () => {
    const announcer = document.createElement('div');
    announcer.id = 'announcer';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only'; // Visually hidden but available to screen readers
    document.body.appendChild(announcer);
    return announcer;
  };

  return { announce };
}

// Utility functions for accessibility
export const a11y = {
  // Generate unique IDs for accessibility attributes
  generateId: (prefix: string) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`,
  
  // Create proper ARIA labels
  createLabel: (label: string, description?: string) => {
    if (description) {
      return `${label}. ${description}`;
    }
    return label;
  },
  
  // Check if element is visible to screen readers
  isVisibleToScreenReader: (element: HTMLElement) => {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0' &&
           !element.hasAttribute('aria-hidden');
  },
  
  // Get proper role for interactive elements
  getRole: (element: HTMLElement) => {
    const tagName = element.tagName.toLowerCase();
    const role = element.getAttribute('role');
    
    if (role) return role;
    
    switch (tagName) {
      case 'button': return 'button';
      case 'a': return 'link';
      case 'input':
        const type = element.getAttribute('type');
        return type === 'checkbox' ? 'checkbox' : 
               type === 'radio' ? 'radio' : 
               'textbox';
      case 'select': return 'combobox';
      case 'textarea': return 'textbox';
      default: return 'generic';
    }
  }
};

// CSS for focus indicators
export const focusStyles = `
  .keyboard-navigation *:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
  
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  
  .skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: #000;
    color: #fff;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 100;
  }
  
  .skip-link:focus {
    top: 6px;
  }
`;