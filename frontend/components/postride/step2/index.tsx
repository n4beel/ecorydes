import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, Modal, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import theme from '@/constants/theme';
import { getStyles } from './styles';

const days_list = [
    { title: 'Mo', value: "monday" },
    { title: 'Tu', value: "tuesday" },
    { title: 'We', value: "wednesday" },
    { title: 'Th', value: "thursday" },
    { title: 'Fr', value: "friday" },
    { title: 'Sa', value: "saturday" },
    { title: 'Su', value: "sunday" },
];

const Step2: React.FC<any> = ({
    isRecurring,
    setIsisRecurring,
    returnTrip,
    setReturnTrip,
    seats,
    setSeats,
    days,
    setDays,
    startTime,
    setStartTime,
    endTime,
    setEndTime
}) => {

    const styles = getStyles();



    const [showModal, setShowModal] = useState(false);
    const [showEndModal, setShowEndModal] = useState(false);
    const [tempDate, setTempDate] = useState<Date>(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1); // Move 1 day forward
        return tomorrow;
    });

    const [tempEndData, setTempEndData] = useState<Date>(new Date(startTime));

    const handleConfirm = () => {
        if (isRecurring) {
            if (isDateAllowed(tempDate)) {
                setStartTime(tempDate);
                setShowModal(false);
            } else {
                alert("Please select a date matching selected days.");
            }
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set to today at midnight
            today.setDate(today.getDate() + 1); // Move to tomorrow

            const selectedDate = new Date(tempDate);
            selectedDate.setHours(0, 0, 0, 0); // Set to selected date at midnight

            if (selectedDate < today) {
                alert("Please select a future date (not today).");
            } else {
                setStartTime(tempDate);
                setShowModal(false);
            }
        }
    };

    const handleEndConfirm = () => {
        setEndTime(tempEndData);
        setShowEndModal(false);
    };

    const handleAdd = () => {
        setSeats(seats + 1)
    }

    const hanldeRemove = () => {
        if (seats === 1) {
            return
        }
        setSeats(seats - 1)
    }

    const getAllowedDays = () => {
        const today = new Date();
        const todayIndex = (today.getDay() + 6) % 7;
        return days_list.filter((_, index) => index > todayIndex).map(d => d.value);
    };

    const isDateAllowed = (selectedDate: Date) => {
        const allowedDays = getAllowedDays();
        const dayName = days_list[(selectedDate.getDay() + 6) % 7].value;
        return allowedDays.includes(dayName);
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.section}>
                    <Text style={{ ...styles.text, paddingLeft: 5 }}>Carpool Schedule</Text>
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, isRecurring === false && styles.activeTab]}
                            onPress={() => setIsisRecurring(false)}
                        >
                            <Text style={styles.tabText}>One Time Trip</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, isRecurring === true && styles.activeTab]}
                            onPress={() => setIsisRecurring(true)}
                        >
                            <Text style={styles.tabText}>Recurring Trip</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.text}>When?</Text>
                    <TouchableOpacity style={styles.input_date} onPress={() => setShowModal(true)}>
                        {startTime ? (
                            <Text style={{ ...styles.text, fontWeight: 400, fontSize: 11 }}>{startTime.toLocaleString()}</Text>
                        ) : (
                            <Text style={styles.date_text}>Pick date & time</Text>
                        )}
                    </TouchableOpacity>

                    {returnTrip && (
                        <>
                            <Text style={styles.text}>Return?</Text>
                            <TouchableOpacity style={styles.input_date} onPress={() => setShowEndModal(true)}>
                                {endTime ? (
                                    <Text style={{ ...styles.text, fontWeight: 400, fontSize: 11 }}>{endTime.toLocaleString()}</Text>
                                ) : (
                                    <Text style={styles.date_text}>Pick date & time</Text>
                                )}
                            </TouchableOpacity>
                        </>
                    )}

                    {isRecurring && (
                        <View style={styles.days}>
                            {days_list.map((d, index) => {
                                const jsTodayIndex = new Date().getDay();
                                const todayIndex = (jsTodayIndex + 6) % 7;
                                const adjustedIndex = (index) % 7;
                                const isFutureDay = adjustedIndex > todayIndex;
                                const isSelected = days[d.value];
                                return (
                                    <TouchableOpacity
                                        key={d.value}
                                        disabled={!isFutureDay}
                                        onPress={() => {
                                            if (isFutureDay) {
                                                setDays({ ...days, [d.value]: !isSelected });
                                            }
                                        }}
                                        style={[
                                            styles.day,
                                            isSelected && { backgroundColor: theme.color.purple, borderColor: theme.color.purple },
                                            !isFutureDay && { opacity: 0.5 },
                                        ]}
                                    >
                                        <Text style={{ color: isSelected ? theme.color.white : theme.color.gray }}>
                                            {d.title}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </View>

                <View style={{ ...styles.section, flexDirection: 'row', alignItems: "center", justifyContent: 'space-between' }}>
                    <Text style={styles.text}>Round Trip</Text>
                    <Switch
                        value={returnTrip}
                        onValueChange={setReturnTrip}
                        thumbColor={returnTrip ? theme.color.white : theme.color.white}
                        trackColor={{ false: theme.color.white, true: theme.color.primary }}
                    />
                </View>

                <View style={{ ...styles.section, flexDirection: 'row', alignItems: "center", justifyContent: 'space-between' }}>
                    <Text style={styles.text}>Number of Seats</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={hanldeRemove}>
                            <Ionicons name='remove-circle-outline' size={30} />
                        </TouchableOpacity>
                        <Text style={{ marginHorizontal: 10 }}>{seats}</Text>

                        <TouchableOpacity onPress={handleAdd}>
                            <Ionicons name='add-circle-outline' size={30} />
                        </TouchableOpacity>
                    </View>
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showModal}
                    onRequestClose={() => setShowModal(false)}
                >
                    <View style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        backgroundColor: 'rgba(0,0,0,0.5)'
                    }}>
                        <View style={{
                            backgroundColor: 'white',
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            padding: 20,
                        }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Select Date</Text>
                            <DateTimePicker
                                value={tempDate}
                                mode="date"
                                display="spinner"
                                onChange={(event, selectedDate) => {
                                    if (selectedDate) {
                                        setTempDate(selectedDate);
                                    }
                                }}
                                minimumDate={new Date()}
                            />
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Select Time</Text>
                            <DateTimePicker
                                value={tempDate}
                                mode="time"
                                display="spinner"
                                is24Hour={true}
                                onChange={(event, selectedDate) => {
                                    if (selectedDate) {
                                        setTempDate(selectedDate);
                                    }
                                }}
                            />

                            <Button title="Confirm" onPress={handleConfirm} />
                        </View>
                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showEndModal}
                    onRequestClose={() => setShowEndModal(false)}
                >
                    <View style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        backgroundColor: 'rgba(0,0,0,0.5)'
                    }}>
                        <View style={{
                            backgroundColor: 'white',
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            padding: 20,
                        }}>
                            {/* <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Select Date</Text>
                            <DateTimePicker
                                value={tempDate}
                                mode="date"
                                display="spinner"
                                onChange={(event, selectedDate) => {
                                    if (selectedDate) {
                                        setTempDate(selectedDate);
                                    }
                                }}
                                minimumDate={new Date()}
                            /> */}
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Select Return Time</Text>
                            <DateTimePicker
                                value={tempEndData}
                                mode="time"
                                display="spinner"
                                is24Hour={true}
                                onChange={(event, selectedDate) => {
                                    console.log(selectedDate)
                                    if (selectedDate) {
                                        const updatedDate = new Date(startTime); // startTime has the correct date
                                        updatedDate.setHours(selectedDate.getHours());
                                        updatedDate.setMinutes(selectedDate.getMinutes());
                                        updatedDate.setSeconds(0);
                                        updatedDate.setMilliseconds(0);
                                
                                        setTempEndData(updatedDate);
                                    }
                                }}
                            />

                            <Button title="Confirm" onPress={handleEndConfirm} />
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
};

export default Step2;
