import { Button, useToast } from '@chakra-ui/react';

const SignOutButton: React.FC = () => {
  const toast = useToast();

  const signOut = async () => {
    try {
      const response = await fetch('/auth/signout', {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to sign out.');

      // Redirect or refresh the page upon successful signout
      window.location.href = '/';
    } catch (error) {
      toast({
        title: 'Error signing out',
        description: (error as Error).message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Button colorScheme="red" onClick={signOut}>
      Sign out
    </Button>
  );
};

export default SignOutButton;
