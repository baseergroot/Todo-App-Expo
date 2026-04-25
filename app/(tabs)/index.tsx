import { Image } from 'expo-image';
import { Platform, Pressable, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useCallback, useEffect, useState } from 'react';
import apiClient from '@/helpers/axios';
import { deleteToken, getToken } from '@/helpers/authStorage';
import { useFocusEffect } from '@react-navigation/native';
import { Link } from 'expo-router';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface User {
  id: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

export default function HomeScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const fetchTodos = async () => {
    try {
      const authToken = await getToken();
      const response = await apiClient.get('/api/all-todos', {
        headers: {
          "auth-token": authToken
        }
      });
      const data = response.data;
      console.log(data);
      setTodos(data.todos || []);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setTodos([]);
    }
  }

  const getUser = async () => {
    const res = await apiClient.get('/api/user', {
      headers: {
        "auth-token": await getToken()
      }
    });
    console.log("user ", res.data);
    setUser(res.data.user)
  }

  useFocusEffect(
    useCallback(() => {
      fetchTodos(); // Your function to get data from the API
      getUser();
    }, [])
  );



  const logout = async () => {

    await deleteToken()
  }

  const deleteTodo = async (todoId: string) => {
    console.log("delete todo")

    const response = await apiClient.delete(`/api/delete-todo`, {
      data: {
        todoId: todoId
      },

      headers: {
        "auth-token": await getToken()
      }
    })
    console.log("delete res: ", response.data)
    fetchTodos()
  }


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView className='flex-1 items-center justify-center' style={styles.titleContainer}>
        <ThemedText className='' type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      
      {
        !user ? <ThemedView>
          <ThemedText>Login to continue</ThemedText>
          <Link href="/(tabs)/login" asChild>
            <ThemedText style={styles.buttonStyle}>Login</ThemedText>
          </Link>
        </ThemedView> : <Pressable onPress={() => logout()}>
          <ThemedText style={styles.buttonStyle}>Logout</ThemedText>
        </Pressable>

      }
      {todos.length < 1 ? <ThemedView>
        <ThemedView>
          <ThemedText>No todos found</ThemedText>

        </ThemedView>

      </ThemedView> :
        todos.reverse().map((todo) => (
          <ThemedView key={todo.id}>
            <ThemedText>{todo.title}</ThemedText>
            <Pressable onPress={() => deleteTodo(todo.id.toString())}>
              <ThemedText style={styles.buttonStyle}>Delete</ThemedText>
            </Pressable>
          </ThemedView>
        ))}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },

  buttonStyle: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  }
});
