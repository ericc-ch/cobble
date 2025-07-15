// in jsx.d.ts

declare namespace JSX {
  interface IntrinsicElements {
    // Top-level prompt structure tags
    system_message: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >
    instructions: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >
    context: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >
    instruction: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >

    // Tags within the context
    project_files: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >

    // The file tag with its custom 'path' attribute
    file: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & { path: string },
      HTMLElement
    >
  }
}
