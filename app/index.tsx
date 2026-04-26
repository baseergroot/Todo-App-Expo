
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import apiClient from '@/helpers/axios';
import { deleteToken, getToken } from '@/helpers/authStorage';
import { useFocusEffect } from '@react-navigation/native';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddTodo from '@/components/todo/add-todo';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface User {
  id: string;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

export default function HomeScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [showAddTodo, setShowAddTodo] = useState<boolean>(false);

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
    console.log("user :", res.data);
    setUser(res.data.user)
  }

  useFocusEffect(
    useCallback(() => {
      fetchTodos(); // Your function to get data from the API
      getUser();
    }, [])
  );

  const handleAddOption = () => {
    setShowAddTodo(prev => !prev);
    console.log(!showAddTodo)
  }

  

  const logout = async () => {

    await deleteToken()
    router.replace('/login')
    getUser()
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
    <SafeAreaView className='flex-1 items-center justify-center pt-20 bg-gray-500'>
      <Text className='text-white bg-green-500 px-5 py-3 rounded-md font-bold text-lg mb-5'>
        Welcome to Todo App
      </Text>

      <View className='flex-1 items-center justify-center'>
        {
          !user ? <>
            <Link href="/login" asChild>
              <Text>Login to continue</Text>
            </Link>
          </> : <>
            <Text className='text-2xl font-bold'>Logged in as {user.username}</Text>
            <ScrollView className='w-screen flex flex-col'>
            {
              showAddTodo ? <AddTodo setShowAddTodo={setShowAddTodo} /> : <View className='flex flex-col gap-5 mt-5 w-3/4 mx-auto'>
              {
                todos.length > 0 ? <>
                  <View className='flex flex-row justify-between'>
                    <Text className='font-bold text-lg'>List of todos</Text>
                  <Pressable onPress={() => logout()}>
                    <Text className='bg-amber-400 text-center font-bold rounded px-3 py-1 '>Logout</Text>
                  </Pressable>
                  </View>
                  <View className='space-y-5 w-3/4 mx-auto flex flex-col gap-5'>
                    {
                      todos.map((todo) => (
                        <View key={todo.id} className='w-3/4 flex flex-row gap-10 justify-between items-center space-x-3 bg-slate-500 border-2 border-white/30 px-2 py-1 rounded'>
                          <Text className='text-white font-bold'>{todo.title}</Text>
                          {/* <Text>{todo.completed ? "Completed" : "Pending"}</Text> */}
                          <Pressable onPress={() => deleteTodo(todo.id.toString())} >
                            <Text className='bg-red-500 text-center font-bold rounded px-2 py-1 '>Done</Text>
                          </Pressable>
                        </View>
                      ))
                    }
                  </View>
                   <Pressable onPress={handleAddOption}>
                    <Text className='bg-amber-500 text-center font-bold rounded px-5 py-1' >Add todo</Text>
                  </Pressable>
                </> : <>
                  <Text className='text-xl'>No todos found</Text>
                  <Pressable onPress={() => logout()}>
                    <Text className='bg-red-500 text-center font-bold rounded px-1 py-2 '>Logout</Text>
                  </Pressable>
                  <Pressable onPress={handleAddOption}>
                    <Text className='bg-amber-500 text-center font-bold rounded px-5 py-1' >Add todo</Text>
                  </Pressable>
                </>
              } 
            </View>
            }
            </ScrollView>

          </>
        }
      </View>
    </SafeAreaView>



  );
}




