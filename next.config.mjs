import withPWA from 'next-pwa';

const nextConfig = {
  // next.js config
};

export default withPWA({
  dest: 'public',
  ...nextConfig
});
