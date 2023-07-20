import { Request, Response } from "express"
import { PatientController, PatientControllerImpl } from "../api/components/pacientes/controller"
import { PatientService } from "../api/components/pacientes/service"
import { Patient, PatientReq } from "../api/components/pacientes/model"

const mockReq = {} as Request
const mockRes = {} as Response

describe('PatientController', () => {
    let patientService: PatientService
    let patientController: PatientController

    beforeEach(() => {
        patientService = {
            getAllPatients: jest.fn(),
            createPatient: jest.fn(),
            getPatientById: jest.fn(),
            updatePaciente: jest.fn(),
            deletePaciente: jest.fn()
        }

        patientController = new PatientControllerImpl(patientService)
        mockRes.status = jest.fn().mockReturnThis()
        mockRes.json = jest.fn().mockReturnThis()
    })

    describe('getAllPatients', () => {
        it('should get all patients', async () => {
            // Mock Process
            const patients: Patient[] = [
                { id_paciente: 1, nombre: 'Andres', apellido: 'Cruz', identificacion: '155555550', telefono: 222222,createdAt:new Date(Date.now()),updatedAt:new Date(Date.now()) },
                { id_paciente: 2, nombre: 'Alveiro', apellido: 'Tarsisio', identificacion: '11254555', telefono: 3112101,createdAt:new Date(Date.now()),updatedAt:new Date(Date.now()) },
            ];

            (patientService.getAllPatients as jest.Mock).mockResolvedValue(patients)

            // Method execution
            await patientController.getAllPatient(mockReq, mockRes)

            // Asserts
            expect(patientService.getAllPatients).toHaveBeenCalled()
            expect(mockRes.json).toHaveBeenCalledWith(patients)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('should be handler error and return 400 status', async () => {
            const error = new Error('Internal Server Error');
            (patientService.getAllPatients as jest.Mock).mockRejectedValue(error)

            await patientController.getAllPatient(mockReq, mockRes)

            expect(patientService.getAllPatients).toHaveBeenCalled()
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Error getting all patients" })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })

    describe('createPatient', () => {
        it('should create a new patient and return info', async () => {
            // Mock Process
            const patientRes: Patient = { id_paciente: 1, nombre: 'Andres', apellido: 'Cruz', identificacion: '155555550', telefono: 222222,createdAt:new Date(Date.now()),updatedAt:new Date(Date.now()) }
            const patientReq: PatientReq = {
                nombre: 'Andres',
                apellido: 'Cruz',
                identificacion: '155555550',
                telefono: 222222
            };
            (mockReq.body as PatientReq) = patientReq;
            (patientService.createPatient as jest.Mock).mockResolvedValue(patientRes)

            // Method execution
            await patientController.createPatient(mockReq, mockRes)

            // Asserts
            expect(patientService.createPatient).toHaveBeenCalledWith(patientReq)
            expect(mockRes.json).toHaveBeenCalledWith(patientRes)
            expect(mockRes.status).toHaveBeenCalledWith(201)
        })

        it('should be handler error and return 400 status', async () => {
            const error = new Error('Internal Server Error');
            (mockReq.body) = {};
            (patientService.createPatient as jest.Mock).mockRejectedValue(error)

            await patientController.createPatient(mockReq, mockRes)

            expect(patientService.createPatient).toHaveBeenCalledWith({})
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Internal Server Error" })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })

    describe('getPatientById', () => {
        it('should get patient by id', async () => {
            // Mock Process
            const patientRes: Patient = { id_paciente: 1, nombre: 'Andres', apellido: 'Cruz', identificacion: '155555550', telefono: 222222,createdAt:new Date(Date.now()),updatedAt:new Date(Date.now()) };
            (mockReq.params) = { id: "1" };
            (patientService.getPatientById as jest.Mock).mockResolvedValue(patientRes)

            // Method execution
            await patientController.getPatientById(mockReq, mockRes)

            // Asserts
            expect(patientService.getPatientById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith(patientRes)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('should return 400 if patient not found', async () => {
            (mockReq.params) = { id: "1" };
            (patientService.getPatientById as jest.Mock).mockResolvedValue(null)

            await patientController.getPatientById(mockReq, mockRes)

            expect(patientService.getPatientById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Record has not found yet" })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })

        it('should return 400 if an error occurs', async () => {
            const error = new Error('Internal Server Error');
            (mockReq.params) = { id: "1" };
            (patientService.getPatientById as jest.Mock).mockRejectedValue(error)

            await patientController.getPatientById(mockReq, mockRes)

            expect(patientService.getPatientById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Failed to retrieve patient" })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })
})