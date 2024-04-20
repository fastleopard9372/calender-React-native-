import React, { useState } from "react";
import { Button, IconButton, PaperProvider, Menu } from "react-native-paper";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import moment from "moment";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useAppSelector, useAppDispatch } from "../redux/hook";
import {
	setDate,
	setKind,
	getCalender,
	setIsShowDialog,
	setIsTaskShowShowDialog,
	setAction,
	setNewPlan,
} from "../redux/calenderSlice";

const App = () => {
	const [visible, setVisible] = React.useState({
		year: false,
		month: false,
		kind_flag: false,
	});
	const [showCalender, setShowCalender] = useState(false);
	const dispatch = useAppDispatch();
	const date = moment(useAppSelector(getCalender).date);
	const handleClickMonth = (kind, value) => {
		dispatch(setDate(date.clone().add(value, kind).format("20YY-MM-DD")));
	};
	const handleClickMonthD = (value) => {
		dispatch(setDate(date.clone().month(value).format("20YY-MM-DD")));
	};
	const handleClickYear = (year) => {
		dispatch(setDate(date.clone().year(year).format("20YY-MM-DD")));
	};
	const handleClickToday = () => {
		dispatch(setDate(moment(new Date()).format("20YY-MM-DD")));
	};
	const handleClickKind = (m_kind) => {
		dispatch(setKind(m_kind));
	};
	const handleDateChange = (date) => {
		setShowCalender(false);
		dispatch(setDate(date.format("20YY-MM-DD")));
	};
	const handleDialogOpen = () => {
		dispatch(
			setNewPlan({
				id: "",
				color: "indigo",
				width: 2,
				startDate: moment(new Date()).format("YYYY-MM-DD"),
				endDate: moment(new Date()).format("YYYY-MM-DD"),
				demo: "",
				kind: "-1",
				title: "",
				user: {
					id: "",
					name: "",
					email: "",
				},
			})
		);
		dispatch(setAction("Create"));
		dispatch(setIsShowDialog(true));
		dispatch(setIsTaskShowShowDialog(false));
	};
	const openMenuYear = () => setVisible({ year: true, month: false, kind_flag: false });
	const openMenuMonth = () => setVisible({ year: false, month: true, kind_flag: false });
	const openMenuKind = () => setVisible({ year: false, month: false, kind_flag: true });
	const closeMenu = () => setVisible({ year: false, month: false, kind_flag: false });
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<PaperProvider>
					<View style={styles.appMenu}>
						<IconButton icon="plus" mode="contained" size={20} onPress={handleDialogOpen} />
						<Button mode="elevated" onPress={handleClickToday}>
							Today
						</Button>
						<IconButton icon="arrow-left" mode="contained" size={20} onPress={() => handleClickMonth("months", -1)} />
						<View
							style={{
								flexDirection: "row",
								justifyContent: "center",
							}}
						>
							<Button mode="elevated" onPress={() => setShowCalender(true)}>
								{moment(useAppSelector(getCalender).date).format("YYYY - MM")}
							</Button>
							{showCalender && (
								<RNDateTimePicker
									value={moment(date).toDate()}
									display="spinner"
									mode="date"
									onChange={(e, date) => handleDateChange(moment(date))}
								/>
							)}
							{/* <Menu
								visible={visible.year}
								onDismiss={closeMenu}
								anchor={<Button onPress={openMenuYear}> {date.format("20YY")} </Button>}
							>
								{Array(6)
									.fill(0)
									.map((v, i) => (
										<Menu.Item
											key={i}
											onPress={() => handleClickYear(date.year() + i - 3)}
											title={Number(date.format("20YY")) + i - 3}
										/>
									))}
							</Menu>
							<Menu
								visible={visible.month}
								onDismiss={closeMenu}
								anchor={<Button onPress={openMenuMonth}> {date.format("MMM")} </Button>}
							>
								{Array(12)
									.fill(0)
									.map((v, i) => (
										<Menu.Item key={i} onPress={() => handleClickMonthD(i)} title={moment().month(i).format("MMM")} />
									))}
							</Menu> */}
						</View>
						<IconButton icon="arrow-right" mode="contained" size={20} onPress={() => handleClickMonth("months", +1)} />

						<View
							style={{
								flexDirection: "row",
								justifyContent: "center",
							}}
						>
							<Menu
								visible={visible.kind_flag}
								onDismiss={closeMenu}
								anchor={
									<IconButton icon="dots-vertical" onPress={openMenuKind}>
										{" "}
									</IconButton>
								}
							>
								<Menu.Item onPress={() => handleClickKind("month_1")} title="Month 1" />
								<Menu.Item onPress={() => handleClickKind("month_2")} title="Month 2" />
								<Menu.Item onPress={() => handleClickKind("week")} title="Week" />
							</Menu>
						</View>
					</View>
				</PaperProvider>
			</View>
		</SafeAreaView>
	);
};
const styles = StyleSheet.create({
	appMenu: {
		flex: 1,
		flexWrap: "wrap",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		gap: 1,
	},
	container: {
		height: 120,
		position: "relative",

		zIndex: 1000,
	},
	header: {
		flex: 1,
		padding: 16,
		paddingTop: 48,
	},
});

export default App;
