
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Key, User, Lock, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
  serviceName: string;
}

const AuthModal = ({ isOpen, onClose, onAuthSuccess, serviceName }: AuthModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing credentials",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate ConsentFlow authentication
    setTimeout(() => {
      toast({
        title: "Authentication successful",
        description: "Redirecting to data consent...",
      });
      setIsLoading(false);
      onAuthSuccess();
    }, 2000);
  };

  const handleCertificateLogin = async () => {
    if (!certificateFile) {
      toast({
        title: "No certificate selected",
        description: "Please select a digital certificate file",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate digital certificate authentication
    setTimeout(() => {
      toast({
        title: "Certificate verified",
        description: "Authentication successful, redirecting to data consent...",
      });
      setIsLoading(false);
      onAuthSuccess();
    }, 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCertificateFile(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-xl">ConsentFlow Authentication</DialogTitle>
          </div>
          <p className="text-sm text-gray-600">
            Authenticate to access <span className="font-semibold">{serviceName}</span>
          </p>
        </DialogHeader>

        <Tabs defaultValue="password" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="password" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Password</span>
            </TabsTrigger>
            <TabsTrigger value="certificate" className="flex items-center space-x-2">
              <Key className="h-4 w-4" />
              <span>Certificate</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="password">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-blue-600" />
                  <span>Login with Password</span>
                </CardTitle>
                <CardDescription>
                  Enter your credentials to authenticate via ConsentFlow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Authenticating...' : 'Authenticate'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificate">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Key className="h-5 w-5 text-purple-600" />
                  <span>Digital Certificate</span>
                </CardTitle>
                <CardDescription>
                  Upload your digital certificate for secure authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="certificate">Certificate File</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <input
                      id="certificate"
                      type="file"
                      accept=".p12,.pfx,.pem,.crt"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="certificate" className="cursor-pointer">
                      <span className="text-sm text-gray-600">
                        {certificateFile ? certificateFile.name : 'Click to upload certificate'}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        Supports .p12, .pfx, .pem, .crt files
                      </p>
                    </label>
                  </div>
                </div>
                <Button 
                  onClick={handleCertificateLogin}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
                  disabled={isLoading || !certificateFile}
                >
                  {isLoading ? 'Verifying Certificate...' : 'Authenticate with Certificate'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900">Secure Authentication</p>
              <p className="text-xs text-blue-700 mt-1">
                Your authentication is processed securely through ConsentFlow. 
                After authentication, you'll be redirected to select which personal data to share from your Solid pod.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
