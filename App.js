import { StatusBar } from "expo-status-bar";
import React from "react";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Header from "./layout/header";

export default function App() {
	return (
		<Provider store={store}>
			<View style={styles.container}>
				<Header />
				<Text>App.js to start working on your app!</Text>
				<Text>This is my first application!</Text>
				<StatusBar style="auto" />
			</View>
		</Provider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
