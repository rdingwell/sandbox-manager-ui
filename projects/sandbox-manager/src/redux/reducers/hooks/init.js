export default {
    services: [],
    cards: {cards: [], time: 0},
    hookContexts: {
        'patient-view': {
            userId: {
                required: true,
                title: 'User id',
                type: 'string'
            },
            patientId: {
                required: true,
                title: 'Patient id',
                resourceType: 'Patient',
                type: 'string'
            },
            encounterId: {
                required: false,
                title: 'Encounter id',
                resourceType: 'Encounter',
                type: 'string'
            }
        },
        'medication-prescribe': {
            userId: {
                required: true,
                title: 'User id',
                type: 'string'
            },
            patientId: {
                required: true,
                title: 'Patient id',
                resourceType: 'Patient',
                type: 'string'
            },
            medications: {
                required: true,
                title: 'Medications',
                type: 'object',
                resourceType: {
                    5: {
                        type: 'MedicationOrder',
                        crit: {
                            status: 'draft'
                        },
                        query: 'MedicationOrder?status=draft'
                    },
                    8: {
                        type: 'MedicationOrder',
                        crit: {
                            status: 'draft'
                        },
                        query: 'MedicationOrder?status=draft'
                    },
                    6: {
                        type: 'MedicationRequest',
                        crit: {
                            status: 'draft'
                        },
                        query: 'MedicationRequest?status=draft'
                    },
                    9: {
                        type: 'MedicationRequest',
                        crit: {
                            status: 'draft'
                        },
                        query: 'MedicationRequest?status=draft'
                    },
                    7: {
                        type: 'MedicationRequest',
                        crit: {
                            status: 'draft'
                        },
                        query: 'MedicationRequest?status=draft'
                    },
                    10: {
                        type: 'MedicationRequest',
                        crit: {
                            status: 'draft'
                        },
                        query: 'MedicationRequest?status=draft'
                    }
                }
            },
            encounterId: {
                required: false,
                title: 'Encounter id',
                resourceType: 'Encounter',
                type: 'string'
            }
        },
        'order-review': {
            userId: {
                required: true,
                title: 'User id',
                type: 'string'
            },
            patientId: {
                required: true,
                title: 'Patient id',
                resourceType: 'Patient',
                type: 'string'
            },
            encounterId: {
                required: false,
                title: 'Encounter id',
                resourceType: 'Encounter',
                type: 'string'
            },
            orders: {
                required: false,
                title: 'Orders',
                type: 'object',
                resourceType: {
                    5: {
                        type: 'MedicationOrder',
                        crit: {
                            status: 'draft'
                        },
                        query: 'MedicationOrder?status=draft'
                    },
                    8: {
                        type: 'MedicationOrder',
                        crit: {
                            status: 'draft'
                        },
                        query: 'MedicationOrder?status=draft'
                    },
                    6: {
                        type: 'MedicationRequest',
                        crit: {
                            status: 'draft'
                        },
                        query: 'MedicationRequest?status=draft'
                    },
                    9: {
                        type: 'MedicationRequest',
                        crit: {
                            status: 'draft'
                        },
                        query: 'MedicationRequest?status=draft'
                    },
                    7: {
                        type: 'MedicationRequest',
                        crit: {
                            status: 'draft'
                        },
                        query: 'MedicationRequest?status=draft'
                    },
                    10: {
                        type: 'MedicationRequest',
                        crit: {
                            status: 'draft'
                        },
                        query: 'MedicationRequest?status=draft'
                    }
                }
            }
        },
        'order-select': {
            userId: {
                required: true,
                title: 'User id',
                type: 'string'
            },
            patientId: {
                required: true,
                title: 'Patient id',
                resourceType: 'Patient',
                type: 'string'
            },
            encounterId: {
                required: false,
                title: 'Encounter id',
                resourceType: 'Encounter',
                type: 'string'
            },
            selection: {
                required: true,
                title: 'Selection',
                resourceType: 'MedicationRequest',
                type: 'array'
            },
            draftOrders: {
                required: false,
                title: 'Orders',
                type: 'object',
                resourceType: {
                    5: {
                        type: 'MedicationOrder',
                        crit: {
                            status: 'draft'
                        },
                        query: 'MedicationOrder?status=draft'
                    },
                    8: {
                        type: 'MedicationOrder',
                        crit: {
                            status: 'draft'
                        },
                        query: 'MedicationOrder?status=draft'
                    },
                    6: {
                        type: 'MedicationRequest',
                        crit: {
                            status: 'draft'
                        },
                        query: 'MedicationRequest?status=draft'
                    },
                    9: {
                        type: 'MedicationRequest',
                        crit: {
                            status: 'draft'
                        },
                        query: 'MedicationRequest?status=draft'
                    },
                    7: {
                        type: 'MedicationRequest',
                        crit: {
                            status: 'draft'
                        },
                        query: 'MedicationRequest?status=draft'
                    },
                    10: {
                        type: 'MedicationRequest',
                        crit: {
                            status: 'draft'
                        },
                        query: 'MedicationRequest?status=draft'
                    }
                }
            }
        },
        'order-sign': {
            userId: {
                required: true,
                title: 'User id',
                type: 'string'
            },
            patientId: {
                required: true,
                title: 'Patient id',
                resourceType: 'Patient',
                type: 'string'
            },
            encounterId: {
                required: false,
                title: 'Encounter id',
                resourceType: 'Encounter',
                type: 'string'
            },
            draftOrders: {
                required: false,
                title: 'Orders',
                type: 'object',
                resourceType: {
                    5: {
                        type: 'MedicationOrder',
                        crit: {
                            status: 'draft'
                        },
                        query: 'MedicationOrder?status=draft'
                    },
                    8: {
                        type: 'MedicationOrder',
                        crit: {
                            status: 'draft'
                        },
                        query: 'MedicationOrder?status=draft'
                    },
                    6: {
                        type: 'MedicationRequest',
                        crit: {
                            status: 'draft'
                        },
                        query: 'MedicationRequest?status=draft'
                    },
                    9: {
                        type: 'MedicationRequest',
                        crit: {
                            status: 'draft'
                        },
                        query: 'MedicationRequest?status=draft'
                    },
                    7: {
                        type: 'MedicationRequest',
                        crit: {
                            status: 'draft'
                        },
                        query: 'MedicationRequest?status=draft'
                    },
                    10: {
                        type: 'MedicationRequest',
                        crit: {
                            status: 'draft'
                        },
                        query: 'MedicationRequest?status=draft'
                    }
                }
            }
        },
        'appointment-book': {
            userId: {
                required: true,
                title: 'User id',
                type: 'string'
            },
            patientId: {
                required: true,
                title: 'Patient id',
                resourceType: 'Patient',
                type: 'string'
            },
            encounterId: {
                required: false,
                title: 'Encounter id',
                resourceType: 'Encounter',
                type: 'string'
            },
            appointments: {
                required: true,
                title: 'Orders',
                type: 'object',
                resourceType: {
                    5: {
                        type: 'Appointment',
                        crit: {
                            status: 'proposed'
                        },
                        query: 'Appointment?status=proposed'
                    },
                    8: {
                        type: 'Appointment',
                        crit: {
                            status: 'proposed'
                        },
                        query: 'Appointment?status=proposed'
                    },
                    6: {
                        type: 'Appointment',
                        crit: {
                            status: 'proposed'
                        },
                        query: 'Appointment?status=proposed'
                    },
                    9: {
                        type: 'Appointment',
                        crit: {
                            status: 'proposed'
                        },
                        query: 'Appointment?status=proposed'
                    },
                    7: {
                        type: 'Appointment',
                        crit: {
                            status: 'proposed'
                        },
                        query: 'Appointment?status=proposed'
                    },
                    10: {
                        type: 'Appointment',
                        crit: {
                            status: 'proposed'
                        },
                        query: 'Appointment?status=proposed'
                    }
                }
            }
        },
        'encounter-start': {
            userId: {
                required: true,
                title: 'User id',
                type: 'string'
            },
            patientId: {
                required: true,
                title: 'Patient id',
                resourceType: 'Patient',
                type: 'string'
            },
            encounterId: {
                required: true,
                title: 'Encounter id',
                resourceType: 'Encounter',
                type: 'string'
            }
        },
        'encounter-discharge': {
            userId: {
                required: true,
                title: 'User id',
                type: 'string'
            },
            patientId: {
                required: true,
                title: 'Patient id',
                resourceType: 'Patient',
                type: 'string'
            },
            encounterId: {
                required: true,
                title: 'Encounter id',
                resourceType: 'Encounter',
                type: 'string'
            }
        }
    },
    changed: []
}
