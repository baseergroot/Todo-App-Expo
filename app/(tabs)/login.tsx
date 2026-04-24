import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useState } from 'react'
import { styles } from './create-account';
import { TextInput, View, Button, Pressable } from 'react-native';
import { saveToken } from '@/helpers/authStorage';
import apiClient from '@/helpers/axios';

const Login = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const LoginAction = async () => {
		console.log(username, password)
		const res = await apiClient.post('/api/login', { username, password })
		const token = res.data.token
		console.log({res: res.data})

		await saveToken(token)
	}

	return (
		<ThemedView style={styles.marginTop}>
			<ThemedText>login</ThemedText>
			<View>
				<TextInput placeholder='Username' style={styles.input} value={username} onChangeText={setUsername}/>
				<TextInput placeholder='Password' style={styles.input} value={password} onChangeText={setPassword}/>
				<Pressable onPress={LoginAction}>
					<ThemedText style={styles.buttonStyle}>Login</ThemedText>
				</Pressable>
			</View>
		</ThemedView>
	)
}

export default Login