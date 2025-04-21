import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from "sonner";
import { Cloud, LogIn } from 'lucide-react';

interface LocationState {
  from?: {
    pathname: string;
  };
}

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = (location.state as LocationState)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <Cloud className="h-8 w-8 text-weather-blue" />
              <span className="text-xl font-bold bg-gradient-to-r from-weather-blue to-weather-yellow bg-clip-text text-transparent">SunSeeker</span>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your@email.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></span>
                    Logging in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Login
                  </span>
                )}
              </Button>
              <div className="text-center text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                  Register
                </Link>
              </div>

              <div className="bg-gray-50 p-3 rounded-md text-sm text-center mt-6">
                <p className="font-medium text-gray-700 mb-1">Demo Account</p>
                <p className="text-gray-600">Email: demo@example.com</p>
                <p className="text-gray-600">Password: password</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
