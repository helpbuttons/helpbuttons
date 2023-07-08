import { Editable, useEditor } from '@wysimark/react';

export default function TextEditor() {
  const editor = useEditor({
    initialMarkdown: 'Type your post text here...',
  });
  return <Editable editor={editor} />;
}
