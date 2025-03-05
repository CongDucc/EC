import React, { useContext, useEffect, useState } from "react";
import {
    View, Text, SafeAreaView, ScrollView, Platform, Pressable, Alert,
    KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ActivityIndicator
} from "react-native";
import { UserDataForm } from "../Components/LoginRegisterComponent/UserDataForm";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackScreenProps } from "../Navigation/RootNavigator";
import { HeadersComponent } from "../Components/HeaderComponents/HeaderComponent";
import { UserType } from "../Components/LoginRegisterComponent/UserContext";

// Thêm validation function
const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
    // Ít nhất 6 ký tự
    return password.length >= 6;
};

const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10,12}$/;
    return phoneRegex.test(phone);
};

const UserAuth = ({ navigation, route }: RootStackScreenProps<"UserLogin">) => {
    const [showRegistrationScreen, setShowRegistrationScreen] = useState<boolean>(false);
    const { firstName, lastName, email, password, confirmPassword, mobileNo } = route.params;
    const { getUserId, setGetUserId } = useContext(UserType);
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

    const userRegistrationParams = {
        firstName: firstName || "",
        lastName: lastName || "",
        email: email || "",
        mobileNo: mobileNo || "",
        password: password || "",
        confirmPassword: confirmPassword || "",
    };

    const [userSignupForm, setUserSignupForm] = useState(userRegistrationParams);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSignUpTextchange = (text: string, fieldName: string) => {
        setUserSignupForm({ ...userSignupForm, [fieldName]: text });

        // Xóa thông báo lỗi khi người dùng chỉnh sửa
        if (validationErrors[fieldName]) {
            setValidationErrors({
                ...validationErrors,
                [fieldName]: ""
            });
        }
    };

    const validateForm = (): boolean => {
        const errors: { [key: string]: string } = {};

        // Kiểm tra các trường bắt buộc
        if (!userSignupForm.firstName) errors.firstName = "Vui lòng nhập tên";
        if (!userSignupForm.lastName) errors.lastName = "Vui lòng nhập họ";

        // Kiểm tra email
        if (!userSignupForm.email) {
            errors.email = "Vui lòng nhập email";
        } else if (!validateEmail(userSignupForm.email)) {
            errors.email = "Email không hợp lệ";
        }

        // Kiểm tra số điện thoại
        if (!userSignupForm.mobileNo) {
            errors.mobileNo = "Vui lòng nhập số điện thoại";
        } else if (!validatePhone(userSignupForm.mobileNo)) {
            errors.mobileNo = "Số điện thoại không hợp lệ";
        }

        // Kiểm tra mật khẩu
        if (!userSignupForm.password) {
            errors.password = "Vui lòng nhập mật khẩu";
        } else if (!validatePassword(userSignupForm.password)) {
            errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
        }

        // Kiểm tra xác nhận mật khẩu
        if (!userSignupForm.confirmPassword) {
            errors.confirmPassword = "Vui lòng nhập lại mật khẩu";
        } else if (userSignupForm.password !== userSignupForm.confirmPassword) {
            errors.confirmPassword = "Mật khẩu không khớp";
        }

        // Cập nhật state validationErrors
        setValidationErrors(errors);

        // Nếu không có lỗi, trả về true
        return Object.keys(errors).length === 0;
    };

    const SubmitRegistrationForm = () => {
        if (isSubmitting) return;

        // Validate form trước khi submit
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setIsLoading(true);

        // Gọi API đăng ký
        axios
            .post("http://192.168.0.103:9000/user/registerUser", userSignupForm)
            .then((response) => {
                Alert.alert(
                    "Đăng ký thành công",
                    "Tài khoản của bạn đã được tạo thành công. Vui lòng đăng nhập để tiếp tục."
                );
                setShowRegistrationScreen(false); // Chuyển đến màn hình đăng nhập
                setUserSignupForm(userRegistrationParams); // Reset form
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi đăng ký";
                Alert.alert("Lỗi đăng ký", errorMessage);
                console.error("Registration error:", error);
            })
            .finally(() => {
                setIsSubmitting(false);
                setIsLoading(false);
            });
    };

    const userLoginParams = {
        email: email || "",
        password: password || "",
    };

    const [userLoginForm, setUserLoginForm] = useState(userLoginParams);

    const handleLoginTextchange = (text: string, fieldName: string) => {
        setUserLoginForm({ ...userLoginForm, [fieldName]: text });

        // Xóa thông báo lỗi khi người dùng chỉnh sửa
        if (validationErrors[fieldName]) {
            setValidationErrors({
                ...validationErrors,
                [fieldName]: ""
            });
        }
    };

    const validateLoginForm = (): boolean => {
        const errors: { [key: string]: string } = {};

        // Kiểm tra email
        if (!userLoginForm.email) {
            errors.loginEmail = "Vui lòng nhập email";
        } else if (!validateEmail(userLoginForm.email)) {
            errors.loginEmail = "Email không hợp lệ";
        }

        // Kiểm tra mật khẩu
        if (!userLoginForm.password) {
            errors.loginPassword = "Vui lòng nhập mật khẩu";
        }

        // Cập nhật state validationErrors
        setValidationErrors(errors);

        // Nếu không có lỗi, trả về true
        return Object.keys(errors).length === 0;
    };

    const SubmitUserLoginForm = () => {
        if (isLoading) return;

        // Validate form trước khi submit
        if (!validateLoginForm()) {
            return;
        }

        setIsLoading(true);

        axios
            .post("http://192.168.0.103:9000/user/loginUser", userLoginForm)
            .then((response) => {
                const token = response.data.token;
                const userId = response.data.userId;

                // Lưu thông tin vào AsyncStorage
                AsyncStorage.setItem("authToken", token);
                AsyncStorage.setItem("userId", userId);

                Alert.alert("Đăng nhập thành công!");

                // Cập nhật context
                setGetUserId(userId);

                // Điều hướng đến màn hình chính
                navigation.navigate("TabsStack", { screen: "Cart" });

                // Reset form
                setUserLoginForm(userLoginParams);
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi đăng nhập";
                Alert.alert("Lỗi đăng nhập", errorMessage);
                console.error("Login error:", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = await AsyncStorage.getItem("authToken");
                const userId = await AsyncStorage.getItem("userId");

                if (userId) {
                    setGetUserId(userId);
                    console.log(`Đã load userId: ${userId}`);
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
            }
        };

        fetchUser();
    }, []);

    const handleKeyboardDismiss = () => {
        Keyboard.dismiss();
    };

    const { screenTitle } = route.params;

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "#fff",
                alignItems: "center",
            }}
        >
            <HeadersComponent
                pageTitle={screenTitle}
                goToPrevios={() => navigation.goBack()}
            />
            <TouchableWithoutFeedback onPress={handleKeyboardDismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <KeyboardAvoidingView>
                            <View style={{ alignItems: "center" }}>
                                <Text
                                    style={{
                                        fontSize: 20,
                                        fontWeight: "bold",
                                        marginTop: 12,
                                        marginBottom: 20,
                                        color: "#041E42",
                                    }}
                                >
                                    {!showRegistrationScreen
                                        ? "Đăng nhập vào tài khoản"
                                        : "Đăng ký tài khoản mới"}
                                </Text>
                            </View>
                            {showRegistrationScreen && (
                                <>
                                    <ScrollView>
                                        <View style={{ marginTop: 10 }}>
                                            <UserDataForm
                                                label="Nhập tên của bạn"
                                                labelColor="black"
                                                duration={300}
                                                text={userSignupForm.firstName}
                                                updateText={(text: string) =>
                                                    handleSignUpTextchange(text, "firstName")
                                                }
                                                error={validationErrors.firstName}
                                            />
                                        </View>
                                        <View style={{ marginTop: 10 }}>
                                            <UserDataForm
                                                label="Nhập họ của bạn"
                                                labelColor="black"
                                                duration={300}
                                                text={userSignupForm.lastName}
                                                updateText={(text: string) =>
                                                    handleSignUpTextchange(text, "lastName")
                                                }
                                                error={validationErrors.lastName}
                                            />
                                        </View>
                                        <View style={{ marginTop: 10 }}>
                                            <UserDataForm
                                                label="Nhập email của bạn"
                                                labelColor="black"
                                                duration={300}
                                                text={userSignupForm.email}
                                                updateText={(text: string) =>
                                                    handleSignUpTextchange(text, "email")
                                                }
                                                error={validationErrors.email}
                                                keyboardType="email-address"
                                            />
                                        </View>
                                        <View style={{ marginTop: 10 }}>
                                            <UserDataForm
                                                label="Nhập số điện thoại của bạn"
                                                labelColor="black"
                                                duration={300}
                                                text={userSignupForm.mobileNo}
                                                updateText={(text: string) =>
                                                    handleSignUpTextchange(text, "mobileNo")
                                                }
                                                error={validationErrors.mobileNo}
                                                keyboardType="phone-pad"
                                            />
                                        </View>
                                        <View style={{ marginTop: 10 }}>
                                            <UserDataForm
                                                label="Nhập mật khẩu của bạn"
                                                labelColor="black"
                                                duration={300}
                                                text={userSignupForm.password}
                                                updateText={(text: string) =>
                                                    handleSignUpTextchange(text, "password")
                                                }
                                                error={validationErrors.password}
                                                isPasswordField={true}
                                            />
                                        </View>
                                        <View style={{ marginTop: 10 }}>
                                            <UserDataForm
                                                label="Xác nhận mật khẩu của bạn"
                                                labelColor="black"
                                                duration={300}
                                                text={userSignupForm.confirmPassword}
                                                updateText={(text: string) =>
                                                    handleSignUpTextchange(text, "confirmPassword")
                                                }
                                                error={validationErrors.confirmPassword}
                                                isPasswordField={true}
                                            />
                                        </View>
                                    </ScrollView>
                                </>
                            )}
                            {!showRegistrationScreen && (
                                <>
                                    <View style={{ marginTop: 30 }}>
                                        <UserDataForm
                                            label="Nhập email của bạn"
                                            labelColor="black"
                                            duration={300}
                                            text={userLoginForm.email}
                                            updateText={(text: string) =>
                                                handleLoginTextchange(text, "email")
                                            }
                                            error={validationErrors.loginEmail}
                                            keyboardType="email-address"
                                        />
                                    </View>
                                    <View style={{ marginTop: 20 }}>
                                        <UserDataForm
                                            label="Nhập mật khẩu của bạn"
                                            labelColor="black"
                                            duration={300}
                                            text={userLoginForm.password}
                                            updateText={(text: string) =>
                                                handleLoginTextchange(text, "password")
                                            }
                                            error={validationErrors.loginPassword}
                                            isPasswordField={true}
                                        />
                                    </View>
                                    <View
                                        style={{
                                            margin: 15,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Text>Ghi nhớ đăng nhập</Text>
                                        <Text style={{ color: "#007fff", fontWeight: "bold" }}>
                                            Quên mật khẩu?
                                        </Text>
                                    </View>
                                </>
                            )}
                            <View style={{ marginTop: 40 }} />
                            {!showRegistrationScreen ? (
                                <Pressable
                                    style={{
                                        width: 200,
                                        backgroundColor: isLoading ? "#ccc" : "#febe10",
                                        borderRadius: 6,
                                        marginLeft: "auto",
                                        marginRight: "auto",
                                        padding: 15,
                                    }}
                                    onPress={SubmitUserLoginForm}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text
                                            style={{
                                                textAlign: "center",
                                                color: "#fff",
                                                fontSize: 16,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Đăng nhập
                                        </Text>
                                    )}
                                </Pressable>
                            ) : (
                                <Pressable
                                    style={{
                                        width: 200,
                                        backgroundColor: isSubmitting || isLoading ? "#ccc" : "#febe10",
                                        borderRadius: 6,
                                        marginLeft: "auto",
                                        marginRight: "auto",
                                        padding: 15,
                                    }}
                                    onPress={SubmitRegistrationForm}
                                    disabled={isSubmitting || isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text
                                            style={{
                                                textAlign: "center",
                                                color: "#fff",
                                                fontSize: 16,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Đăng ký
                                        </Text>
                                    )}
                                </Pressable>
                            )}

                            {!showRegistrationScreen ? (
                                <Pressable
                                    style={{
                                        marginTop: 20,
                                    }}
                                    onPress={() => {
                                        setShowRegistrationScreen(true);
                                        setValidationErrors({});
                                    }}
                                >
                                    <Text
                                        style={{
                                            textAlign: "center",
                                            color: "#555",
                                            fontSize: 16,
                                            fontWeight: "500",
                                        }}
                                    >
                                        Chưa có tài khoản? Đăng ký ngay
                                    </Text>
                                </Pressable>
                            ) : (
                                <Pressable
                                    style={{
                                        marginTop: 20,
                                        marginBottom: 30,
                                    }}
                                    onPress={() => {
                                        setShowRegistrationScreen(false);
                                        setValidationErrors({});
                                    }}
                                >
                                    <Text
                                        style={{
                                            textAlign: "center",
                                            color: "#555",
                                            fontSize: 16,
                                            fontWeight: "500",
                                        }}
                                    >
                                        Đã có tài khoản? Đăng nhập ngay
                                    </Text>
                                </Pressable>
                            )}
                        </KeyboardAvoidingView>
                    </ScrollView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};
export default UserAuth;