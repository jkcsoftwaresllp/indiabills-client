// interface FlexibleOption {
//     offerTypeOptions: string[];
//     addressTypeOptions: string[];
// }

const addressTypeOptions = [
    "Home",
    "Office",
    "Warehouse",
    "Secondary Warehouse",
];

const offerTypeOptions = [
    "Default",
]

export function getFlexibleOptions() {

    return {
        offerTypeOptions: offerTypeOptions,
        addressTypeOptions: addressTypeOptions,
    };
}
