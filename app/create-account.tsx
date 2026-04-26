import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { saveToken } from '@/helpers/authStorage'
import apiClient from '@/helpers/axios'
import React, { useState } from 'react'
import { Pressable, TextInput, View } from 'react-native'
import { StyleSheet } from 'react-native'

const createAccount = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const createAccountAction = async () => {
		console.log(username, password)
		const res = await apiClient.post('/api/create-user', { username, password })
		const token = res.data.token
		console.log({res: res.data})

		await saveToken(token)
	}

	return (
		<ThemedView style={styles.marginTop}>
			<ThemedText>createAccount</ThemedText>

			<View>
				<TextInput placeholder='Username' style={styles.input} value={username} onChangeText={setUsername} />
				<TextInput placeholder='Password' style={styles.input} value={password} onChangeText={setPassword} />
				<Pressable onPress={() => createAccountAction()}>
					<ThemedText style={styles.buttonStyle}>Create Account</ThemedText>
				</Pressable>
			</View>
		</ThemedView>
	)
}

export default createAccount

export const styles = StyleSheet.create({
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

});