import React from 'react';

export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            function getThemePreference() {
              if (typeof localStorage !== 'undefined' && localStorage.getItem('vite-ui-theme')) {
                return localStorage.getItem('vite-ui-theme');
              }
              return window.matchMedia('(prefers-color-scheme: dark)').matches
                        ? 'dark'
                        : 'light';
            }
            const theme = getThemePreference();
            document.documentElement.classList.add(theme);
            document.documentElement.setAttribute('data-theme', theme);
          })();
        `,
      }}
    />
  );
}
