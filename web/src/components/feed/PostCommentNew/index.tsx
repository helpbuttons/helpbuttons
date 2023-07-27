import FieldText from 'elements/Fields/FieldText';
import Form from 'elements/Form';
import t from 'i18n';
import { GlobalState, store } from 'pages';
import { useForm } from 'react-hook-form';
import { alertService } from 'services/Alert';
import { ClearDraftNewPostComment, CreateNewPostComment, SaveDraftNewPostComment } from 'state/Posts';
import { IoPaperPlaneOutline } from 'react-icons/io5';
import { useState, useEffect } from 'react';
import { Dropdown } from 'elements/Dropdown/Dropdown';
import { CommentPrivacyOptions } from 'shared/types/privacy.enum';
import { useStore } from 'store/Store';

export default function PostCommentNew({ postId, onSubmit, isGuest = false }) {
  const {
    register,
    setValue,
    watch,
    setFocus,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const [privacy, setPrivacy] = useState<CommentPrivacyOptions>(CommentPrivacyOptions.PUBLIC)
  const draftNewCommentPost = useStore(
    store,
    (state: GlobalState) => state.draftNewCommentPost,
  );

  useEffect(() => {
    if(draftNewCommentPost && draftNewCommentPost.postId == postId)
    {
      reset(draftNewCommentPost.data)
      store.emit(new ClearDraftNewPostComment());
    }

      
  }, [draftNewCommentPost])
  const onSubmitLocal = (e) => {
    e.preventDefault()
    const data = getValues();

    if(isGuest)
    {
      store.emit(
        new SaveDraftNewPostComment(
          postId,
          data,
        ),
      );
      alertService.info(t('post.needLogin'));
      onSubmit()
      return;  
    }

    store.emit(
      new CreateNewPostComment(
        postId,
        privacy,
        data,
        () => {
          alertService.info('comment posted');
          setValue('message', '')
          onSubmit();
        },
        (errorMessage) => alertService.error(errorMessage.caption),
      ),
    );
  };

  const privacyOptions = [
    {
      name: 'Direct message',
      value: CommentPrivacyOptions.PRIVATE,
    },
    {
      name: 'Public',
      value: CommentPrivacyOptions.PUBLIC,
    },
  ];

  return (
    <Form
      onSubmit={onSubmitLocal}
      classNameExtra="feeds__new-message"
    >
      <Dropdown label="" options={privacyOptions} defaultSelected={CommentPrivacyOptions.PUBLIC} onChange={(value) => {setPrivacy(() => value)}}/>
      <div className="feeds__new-message-message">
        <FieldText
          name="message"
          placeholder={t('comment.placeholderWrite')}
          validationError={errors.description}
          watch={watch}
          setValue={setValue}
          setFocus={setFocus}
          {...register('message', {
            required: true,
            minLength: 10,
          })}
        />
      </div>
      <button
        type="submit"
        className="btn-circle btn-circle__icon btn-circle__content"
      >
        <IoPaperPlaneOutline />
      </button>
    </Form>
  );
}
