
import { useRouter } from 'next/router';
import configEN from '../../public/locales/en/common.json'
import configES from '../../public/locales/es/common.json'

export default function t(key: string) {
    const { locale } = useRouter();
    let keys = key.split('.');
    let config = configEN;
    if (locale === 'es') {
        config = configES;
    }

    try {
        return config[keys[0]][keys[1]];
    }catch(e){
        
    }
    return key;
}