'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/hooks/useAuth';
import { loginSchema, type LoginFormValues } from '@/schemas';
import { handleApiError } from '@/lib/api/client';
import { Scale, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginFormValues>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate with Zod
    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<LoginFormValues> = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof LoginFormValues] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    // Submit login
    try {
      await loginMutation.mutateAsync(formData);
    } catch (error) {
      setErrors({ username: handleApiError(error) });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-background p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <Scale className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">LightField Admin</h1>
          <p className="text-muted-foreground mt-2">Sign in to manage your platform</p>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.username ? 'border-destructive' : 'border-input'
                } bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition`}
                placeholder="Enter your username"
                disabled={loginMutation.isPending}
              />
              {errors.username && (
                <p className="text-destructive text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.password ? 'border-destructive' : 'border-input'
                } bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition`}
                placeholder="Enter your password"
                disabled={loginMutation.isPending}
              />
              {errors.password && (
                <p className="text-destructive text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              ← Back to website
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Secured with industry-standard encryption
        </p>
      </div>
    </div>
  );
}
