export interface userAddressProps {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    moblieNo: string;
    deliveryInfo: string;
    region: string;
    city: string;
}
export interface userModelParams {
    firstName: string;
    lastName: string;
    email: string;
    mobileNo: string;
    password: string;
    confirmPassword?: string;
    userAddressInfo: userAddressProps[];
    userId?: string;
}
export interface userLoginParams {
    email: string;
    password: string;
}

export interface UserAddressParams {
    userAddressForm: userAddressProps;
    getUserId?: string;
}
