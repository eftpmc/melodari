"use client"

import { Flex, Box } from '@chakra-ui/react';
import AuthForm from '@/components/AuthForm'; // Adjust the import path as necessary

const Login: React.FC = () => {
  return (
    <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        pt={8}
      >
        <AuthForm />
    </Flex>
  );
};

export default Login;