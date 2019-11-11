export default {
    services: [],
    cards: {cards: [], time: 0},
    hookContexts: {
        'patient-view': {
            userId: {
                required: true,
                title: 'User id'
            },
            patientId: {
                required: true,
                title: 'Patient id',
                resourceType: 'Patient'
            },
            encounterId: {
                required: false,
                title: 'Encounter id',
                resourceType: 'Encounter'
            }
        },
        'medication-prescribe': {
            userId: {
                required: true,
                title: 'User id'
            },
            patientId: {
                required: true,
                title: 'Patient id',
                resourceType: 'Patient'
            },
            medications: {
                required: true,
                title: 'Medications',
                resourceType: {
                    5: {
                        type: 'MedicationOrder',
                        crit: 'status=draft',
                        query: 'MedicationOrder?status=draft'
                    },
                    8: {
                        type: 'MedicationOrder',
                        crit: 'status=draft',
                        query: 'MedicationOrder?status=draft'
                    },
                    6: {
                        type: 'MedicationRequest',
                        crit: 'status=draft',
                        query: 'MedicationRequest?status=draft'
                    },
                    9: {
                        type: 'MedicationRequest',
                        crit: 'status=draft',
                        query: 'MedicationRequest?status=draft'
                    },
                    7: {
                        type: 'MedicationRequest',
                        crit: 'status=draft',
                        query: 'MedicationRequest?status=draft'
                    },
                    10: {
                        type: 'MedicationRequest',
                        crit: 'status=draft',
                        query: 'MedicationRequest?status=draft'
                    }
                }
            },
            encounterId: {
                required: false,
                title: 'Encounter id',
                resourceType: 'Encounter'
            }
        },
        'order-review': {
            userId: {
                required: true,
                title: 'User id'
            },
            patientId: {
                required: true,
                title: 'Patient id',
                resourceType: 'Patient'
            },
            encounterId: {
                required: false,
                title: 'Encounter id',
                resourceType: 'Encounter'
            },
            orders: {
                required: false,
                title: 'Orders',
                resourceType: {
                    5: {
                        type: 'MedicationOrder',
                        crit: 'status=draft',
                        query: 'MedicationOrder?status=draft'
                    },
                    8: {
                        type: 'MedicationOrder',
                        crit: 'status=draft',
                        query: 'MedicationOrder?status=draft'
                    },
                    6: {
                        type: 'MedicationRequest',
                        crit: 'status=draft',
                        query: 'MedicationRequest?status=draft'
                    },
                    9: {
                        type: 'MedicationRequest',
                        crit: 'status=draft',
                        query: 'MedicationRequest?status=draft'
                    },
                    7: {
                        type: 'MedicationRequest',
                        crit: 'status=draft',
                        query: 'MedicationRequest?status=draft'
                    },
                    10: {
                        type: 'MedicationRequest',
                        crit: 'status=draft',
                        query: 'MedicationRequest?status=draft'
                    }
                }
            }
        },
        'order-select': {
            userId: {
                required: true,
                title: 'User id'
            },
            patientId: {
                required: true,
                title: 'Patient id',
                resourceType: 'Patient'
            },
            encounterId: {
                required: false,
                title: 'Encounter id',
                resourceType: 'Encounter'
            },
            selection: {
                required: false,
                title: 'Selection',
                resourceType: 'MedicationRequest'
            },
            draftOrders: {
                required: false,
                title: 'Orders',
                resourceType: {
                    5: {
                        type: 'MedicationOrder',
                        crit: 'status=draft',
                        query: 'MedicationOrder?status=draft'
                    },
                    8: {
                        type: 'MedicationOrder',
                        crit: 'status=draft',
                        query: 'MedicationOrder?status=draft'
                    },
                    6: {
                        type: 'MedicationRequest',
                        crit: 'status=draft',
                        query: 'MedicationRequest?status=draft'
                    },
                    9: {
                        type: 'MedicationRequest',
                        crit: 'status=draft',
                        query: 'MedicationRequest?status=draft'
                    },
                    7: {
                        type: 'MedicationRequest',
                        crit: 'status=draft',
                        query: 'MedicationRequest?status=draft'
                    },
                    10: {
                        type: 'MedicationRequest',
                        crit: 'status=draft',
                        query: 'MedicationRequest?status=draft'
                    }
                }
            }
        },
        'order-sign': {
            userId: {
                required: true,
                title: 'User id'
            },
            patientId: {
                required: true,
                title: 'Patient id',
                resourceType: 'Patient'
            },
            encounterId: {
                required: false,
                title: 'Encounter id',
                resourceType: 'Encounter'
            },
            draftOrders: {
                required: false,
                title: 'Orders',
                resourceType: {
                    5: {
                        type: 'MedicationOrder',
                        crit: 'status=draft',
                        query: 'MedicationOrder?status=draft'
                    },
                    8: {
                        type: 'MedicationOrder',
                        crit: 'status=draft',
                        query: 'MedicationOrder?status=draft'
                    },
                    6: {
                        type: 'MedicationRequest',
                        crit: 'status=draft',
                        query: 'MedicationRequest?status=draft'
                    },
                    9: {
                        type: 'MedicationRequest',
                        crit: 'status=draft',
                        query: 'MedicationRequest?status=draft'
                    },
                    7: {
                        type: 'MedicationRequest',
                        crit: 'status=draft',
                        query: 'MedicationRequest?status=draft'
                    },
                    10: {
                        type: 'MedicationRequest',
                        crit: 'status=draft',
                        query: 'MedicationRequest?status=draft'
                    }
                }
            }
        },
        'appointment-book': {
            userId: {
                required: true,
                title: 'User id'
            },
            patientId: {
                required: true,
                title: 'Patient id',
                resourceType: 'Patient'
            },
            encounterId: {
                required: false,
                title: 'Encounter id',
                resourceType: 'Encounter'
            },
            appointments: {
                required: true,
                title: 'Orders',
                resourceType: {
                    5: {
                        type: 'Appointment',
                        crit: 'status=proposed',
                        query: 'Appointment?status=proposed'
                    },
                    8: {
                        type: 'Appointment',
                        crit: 'status=proposed',
                        query: 'Appointment?status=proposed'
                    },
                    6: {
                        type: 'Appointment',
                        crit: 'status=proposed',
                        query: 'Appointment?status=proposed'
                    },
                    9: {
                        type: 'Appointment',
                        crit: 'status=proposed',
                        query: 'Appointment?status=proposed'
                    },
                    7: {
                        type: 'Appointment',
                        crit: 'status=proposed',
                        query: 'Appointment?status=proposed'
                    },
                    10: {
                        type: 'Appointment',
                        crit: 'status=proposed',
                        query: 'Appointment?status=proposed'
                    }
                }
            }
        },
        'encounter-start': {
            userId: {
                required: true,
                title: 'User id'
            },
            patientId: {
                required: true,
                title: 'Patient id',
                resourceType: 'Patient'
            },
            encounterId: {
                required: true,
                title: 'Encounter id',
                resourceType: 'Encounter'
            }
        },
        'encounter-discharge': {
            userId: {
                required: true,
                title: 'User id'
            },
            patientId: {
                required: true,
                title: 'Patient id',
                resourceType: 'Patient'
            },
            encounterId: {
                required: true,
                title: 'Encounter id',
                resourceType: 'Encounter'
            }
        }
    }
}
