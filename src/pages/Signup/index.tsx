import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { catchError } from 'rxjs/operators';

import { Link } from 'elements/Link';
import { Layout } from 'components/user/Layout';
import { userService } from 'services/Users';
import { alertService } from 'services/Alert';
import { store } from '../index';
import { useEffect } from 'react';

import { SignupEvent } from './data';


export default function Signup() {

    const router = useRouter();

    // form validation rules
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required('Email is required'),
        password: Yup.string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(user) {
        //emit is called to trigger the event by the observable
        store.emit(new SignupEvent(user.email, user.password));

    }

    return (
        <Layout>
            <div className="card">
                <h4 className="card-header">Register</h4>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label>Email</label>
                            <input name="username" type="text" {...register('email')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.username?.message}</div>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.password?.message}</div>
                        </div>
                        <button disabled={formState.isSubmitting} className="btn btn-primary">
                            {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Register
                        </button>
                        <Link href="/Login" className="btn btn-link">Cancel</Link>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
