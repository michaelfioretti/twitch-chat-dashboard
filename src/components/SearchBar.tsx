import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { SearchIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';

const MotionBox = motion(Box);

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const cardBg = useColorModeValue('gray.800', 'gray.700');
  const borderColor = useColorModeValue('gray.700', 'gray.600');
  const placeholderColor = useColorModeValue('gray.500', 'gray.400');
  const textColor = useColorModeValue('white', 'white');

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearch]);

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      mb={6}
    >
      <InputGroup size="lg">
        <InputLeftElement pointerEvents="none">
          <Icon as={SearchIcon} color={placeholderColor} />
        </InputLeftElement>
        <Input
          placeholder="Search streamers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          bg={cardBg}
          borderColor={borderColor}
          color={textColor}
          _placeholder={{ color: placeholderColor }}
          _hover={{ borderColor: 'purple.400' }}
          _focus={{
            borderColor: 'purple.400',
            boxShadow: '0 0 0 1px rgba(139, 92, 246, 0.3)',
          }}
        />
      </InputGroup>
    </MotionBox>
  );
};

export default SearchBar;
