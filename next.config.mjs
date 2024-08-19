/** @type {import('next').NextConfig} */
import NextFederationPlugin from '@module-federation/nextjs-mf';

process.env.NEXT_PRIVATE_LOCAL_WEBPACK = true;

const nextConfig = {
  reactStrictMode: true,
  webpack(config, options) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'docPortalPipelineUi',
        filename: 'static/chunks/remoteEntry.js',
        exposes: {
          './BaseNode': './components/workflow/nodes/_base/node.tsx',
        },
        shared: ['react', 'react-dom'],
        extraOptions: {
          exposePages: true,
        },
      })
    );

    // Add this section to initialize sharing scope if necessary
    if (options.isServer) {
      config.output.publicPath = '/_next/';
    }

    // Ensure shared scope is initialized correctly
    config.plugins.push({
      apply: (compiler) => {
        compiler.hooks.beforeRun.tap('ModuleFederationPlugin', () => {
          if (typeof __webpack_share_scopes__ !== 'undefined') {
            __webpack_share_scopes__.default = __webpack_share_scopes__.default || {};
          }
        });
      },
    });

    return config;
  },
};

export default nextConfig;
