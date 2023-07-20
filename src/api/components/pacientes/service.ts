import { DoctorCreationError, DoctorDeleteError, DoctorUpdateError, PatientDeleteError, PatientUpdateError, RecordNotFoundError } from "../../../config/customErrors"
import logger from "../../../utils/logger"
import { PatientReq, Patient } from "./model"
import { PatientRepository } from "./repository"


export interface PatientService {
    getAllPatients(): Promise<Patient[]>
    createPatient(patientReq: PatientReq): Promise<Patient>
    getPatientById(id: number): Promise<Patient>
    updatePaciente(id: number, updates:Partial<Patient>): Promise<Patient>
    deletePaciente(id: number): Promise<void>
}

export class PatientServiceImpl implements PatientService {
    private patientRepository: PatientRepository

    constructor(patientRepository: PatientRepository){
        this.patientRepository = patientRepository
    }

    public getAllPatients(): Promise<Patient[]> {
        const patients: Promise<Patient[]> =  this.patientRepository.getAllPatients()
        return patients
    }
    
    public   createPatient(patientReq: PatientReq): Promise<Patient> {
        try{
            return this.patientRepository.createPatient(patientReq)
        } catch (error){
            throw new DoctorCreationError("Failed to create patient from service")
        }
    }

    public getPatientById(id: number): Promise<Patient> {
        try {
            return this.patientRepository.getPatientById(id)
        } catch (error) {
            logger.error('Failed to get patient from service')
            throw new RecordNotFoundError()
        }
    }


    public  async updatePaciente(id: number, updates: Partial<PatientReq>): Promise<Patient> {
        try {
            const existPatient =  await this.patientRepository.getPatientById(id)
            if (!existPatient) {
                throw new RecordNotFoundError()
            }
            const updatedPaciente = {...existPatient, ...updates}
            this.patientRepository.updatePaciente(id, updatedPaciente)
            return updatedPaciente
        } catch (error) {
            logger.error('Failed to update paciente from service')
            throw new PatientUpdateError()
        }
    }

    public async deletePaciente(id: number): Promise<void> {
        try {
            const existDoctor =  await this.patientRepository.getPatientById(id)
            if (!existDoctor) {
                throw new RecordNotFoundError()
            }
            await this.patientRepository.deletePaciente(id)
        } catch (error) {
            logger.error('Failed to delete paciente from service')
            throw new PatientDeleteError()
        }
    }

}