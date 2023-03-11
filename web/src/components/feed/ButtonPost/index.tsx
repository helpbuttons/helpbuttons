import ImageWrapper, { ImageType } from 'elements/ImageWrapper';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { alertService } from 'services/Alert';
import { dateLeft } from 'shared/sys.helper';
import PostComments from '../PostComments';
import PostMessage from '../PostMessage';

export default function ButtonPost({ post, buttonId }) {
  return (
    <>
      <div className="card-notification__text">
            <PostMessage post={post} />
            <PostComments comments={post.comments} />
      </div>
    </>
  );
}
