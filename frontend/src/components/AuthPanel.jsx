import { RegisterForm } from './RegisterForm';
import { LoginForm } from './LoginForm';

export function AuthPanel({ onAuth }) {
  return (
    <div className="grid">
      <RegisterForm onAuth={onAuth} />
      <LoginForm onAuth={onAuth} />
    </div>
  );
}
