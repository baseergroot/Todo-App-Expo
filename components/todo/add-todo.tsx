import { getToken } from "@/helpers/authStorage";
import apiClient from "@/helpers/axios";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";

const AddTodo = ({ setShowAddTodo }: { setShowAddTodo: (value: boolean) => void }) => {
  const [title, setTitle] = useState<string>('');
  const router = useRouter()

  const createTodoAction = async () => {
    const res = await apiClient.post('/api/add-todo', { title }, {
      headers: {
        'auth-token': await getToken()
      }
    })
    console.log("res is ", res.data)
    if (res.data.status) {
      console.log("Todo created successfully")
      setShowAddTodo(false)
      if(router.canGoBack()) {
        router.back()
      }
    }
  }

  const cancelTodo = () => {
    setShowAddTodo(false)
  }

  return (
    <View className='flex flex-col gap-5 w-[80vw] mx-auto'>
      <Text>Add Todo</Text>
      <TextInput className="bg-orange-500 text-white rounded w-full px-2 py-2" placeholder='Title' value={title} onChangeText={setTitle} />
      <Pressable onPress={() => createTodoAction()}>
        <Text className='bg-amber-500 text-center font-bold rounded px-5 py-1' >Add todo</Text>
      </Pressable>
      <Pressable onPress={() => cancelTodo()}>
        <Text className='bg-amber-500 text-center font-bold rounded px-5 py-1' >Cancel</Text>
      </Pressable>
    </View>
  )
}

export default AddTodo