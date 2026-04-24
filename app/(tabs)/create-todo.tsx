import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useState } from 'react'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { TextInput } from 'react-native'
import { getToken } from '@/helpers/authStorage'
import apiClient from '@/helpers/axios'

const CreateTodo = () => {
    const [title, setTitle] = useState('')

    const createTodoAction = async () => {
        const res = await apiClient.post('/api/add-todo', { title }, {
            headers: {
                'auth-token': await getToken()
            }
        })
        console.log("res is ", res.data)
        if (res.data.success) {
            console.log("Todo created successfully")
        }
    }

  return (
    <ThemedView style={styles.marginTop}>
      <ThemedText>create-todo</ThemedText>

      <View>
        <TextInput placeholder='Title' style={styles.input} value={title} onChangeText={setTitle}/>
        <Pressable onPress={() => createTodoAction()}>
            <ThemedText style={styles.buttonStyle}>Create Todo</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  )
}

export default CreateTodo

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
    },

    marginTop: {
        marginTop: 100,
    },

    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        color: "white"
    },

})