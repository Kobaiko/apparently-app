import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
}

export default function Avatar({ 
  source, 
  name = 'User',
  size = 48,
  backgroundColor = '#0ea5e9',
  textColor = '#ffffff'
}: AvatarProps) {
  const getInitials = (fullName: string): string => {
    return fullName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor,
  };

  const textStyle = {
    fontSize: size * 0.4,
    color: textColor,
    fontWeight: '600' as const,
  };

  if (source) {
    return (
      <Image 
        source={{ uri: source }} 
        style={[styles.image, avatarStyle]}
      />
    );
  }

  return (
    <View style={[styles.container, avatarStyle]}>
      <Text style={[styles.text, textStyle]}>
        {getInitials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    letterSpacing: 0.5,
  },
}); 