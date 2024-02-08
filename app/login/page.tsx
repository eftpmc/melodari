"use client"

import { Flex, Box } from '@chakra-ui/react';
import AuthForm from '@/components/AuthForm'; // Adjust the import path as necessary

const Login: React.FC = () => {
  return (
    <Flex height="flexGrow" alignItems="center" justifyContent="center">
      <Box width="full" maxW="md" p="8">
        <AuthForm />
      </Box>
    </Flex>
  );
};

export default Login;