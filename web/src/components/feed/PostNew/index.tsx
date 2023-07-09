import { useEditor } from '@wysimark/react';
import Form from 'elements/Form';
import TextEditor from 'elements/TextEditor';
import t from 'i18n';
import { store } from 'pages';
import { useForm } from 'react-hook-form';
import { IoPaperPlaneOutline } from 'react-icons/io5';
import { alertService } from 'services/Alert';
import { CreateNewPost } from 'state/Posts';

export default function PostNew({ buttonId, onCreate }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm();

  const editor = useEditor({
    initialMarkdown: '',
  });

  const onSubmitLocal = (data) => {
    store.emit(
      new CreateNewPost(
        buttonId,
        {message: data.message},
        () => {
          alertService.success(t('common.saveSuccess', ['post']));
          setValue('message', '')
          editor.resetMarkdown('')
          onCreate()
        },
        (errorMessage) => {console.error(errorMessage); alertService.error(errorMessage.caption)},
      ),
    );
  };

  return (
    <>
      <div className="button-file__action-section">
        <div className="button-file__action-section--field">
          <Form
            onSubmit={handleSubmit(onSubmitLocal)}
            classNameExtra="feeds__new-message"
          >
            <div className="feeds__new-message-message">
            <TextEditor editor={editor} placeholder={t('post.placeholderWrite')} setMessage={(messageMarkDown) => {setValue('message', messageMarkDown)}}/>
            </div>
            <button type="submit" className="btn-circle btn-circle__icon btn-circle__content">
              <IoPaperPlaneOutline />
            </button>
          </Form>
          
        </div>
      </div>
    </>
  );
}
