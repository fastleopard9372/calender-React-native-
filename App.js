import { StatusBar } from "expo-status-bar";
import React from "react";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Header from "./layout/header";
import Calender from "./pages/calender";
export default function App() {
	return (
		<Provider store={store}>
			<View style={styles.container}>
				<Header />
				<Calender />
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
		width: "100vw",
		height: "100vh",
	},
});
