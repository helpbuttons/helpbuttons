import Btn, { BtnType, ContentAlignment, IconType } from "elements/Btn";
import t from "i18n";
import { IoMailOutline, IoSendOutline } from "react-icons/io5";
import { GlobalState, useGlobalStore } from "state";

const canSendMessage = (button, user) => {
    if (!user) {
        return false;
    }

    if (user.id == button.owner.id) {
        return false;
    }
    return true;
};

const isOwner = (button, user) => button.owner.id == user.id;


export function Conversations({ button }) {
    const sessionUser = useGlobalStore(
        (state: GlobalState) => state.sessionUser,
    );
    return <>
            <OpenConversations
            button={button}
            sessionUser={sessionUser}
            />
            <NewConversation
                button={button}
                sessionUser={sessionUser}
            />
        </>
}

function OpenConversations({ button, sessionUser }) {
    if(!isOwner(button, sessionUser))
    {
        return <></>
    }
    return <Btn
        btnType={BtnType.corporative}
        contentAlignment={ContentAlignment.left}
        caption={t('button.openConversations', ['10'])}   //  return <>(#conversation count) View all conversations! </>

        iconLeft={IconType.svg}
        iconLink={<IoSendOutline />}
        onClick={() => console.log('TODO')}
    />
}

function NewConversation({ button, sessionUser }) {
    if(!sessionUser)
    {
        return <></>
    }
    return <Btn
    btnType={BtnType.corporative}
    contentAlignment={ContentAlignment.left}
    caption={t('button.sendMessage')}
    iconLeft={IconType.svg}
    iconLink={<IoSendOutline />}
    onClick={() => console.log('TODO')}
/>
}

export function SendMessageButton({ toggleShowReplyFirstPost, sessionUser, button }) {

    if (!canSendMessage(button, sessionUser)) {
        return;
    }
    return <Btn
        btnType={BtnType.smallCircle}
        contentAlignment={ContentAlignment.center}
        iconLeft={IconType.circle}
        iconLink={<IoMailOutline />}
        onClick={() => {
            toggleShowReplyFirstPost(true)
        }}
    />
}
