import { MDXRemote } from 'next-mdx-remote';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

// Define the components that we want to use in our MDX
const components = {
  // We can override or add custom components here
  // For example, we can create custom interactive blocks like TryIt, DryRun, etc.
  // For now, we'll use the default ones and add our own later
};

interface MdxRendererProps {
  source: MDXRemoteSerializeResult;
  // Optionally, we can pass in custom components
  components?: typeof components;
}

export default function MdxRenderer({ source, components: customComponents }: MdxRendererProps) {
  // Merge custom components with default ones
  const allComponents = {
    ...components,
    ...(customComponents || {}),
  };

  return <MDXRemote {...source} components={allComponents} />;
}