import { Editable } from '@wysimark/react';

export default function TextEditor({setMessage, placeholder, editor}) {

return (<>
  <Editable editor={editor} 
    onChange={() => {
        setMessage(editor.getMarkdown())
      }}
      placeholder={placeholder}/>
  </>
  );
}
