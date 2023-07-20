import { Appointment } from './model'
import { Request, Response } from 'express'
import { AppointmentService } from './service'
import logger from '../../../utils/logger'
//import { DoctorCreationError, DoctorDeleteError, DoctorGetAllError, DoctorUpdateError,AppointmentUpdateError,AppointmentDeleteError, RecordNotFoundError } from '../../../config/customErrors'
import { creationError, deleteError, getAllError, updateError, recordNotFoundError } from '../../../utils/genericErrors'


export interface AppointmentController {
    getAllAppointment(req: Request, res: Response): void
    createAppointment(req: Request, res: Response): void  
    getAppointmentById(req: Request, res: Response): void  
    updateAppointment(req: Request, res: Response): void  
    deleteAppointment(req: Request, res: Response): void  
}

export class AppointmentControllerImpl implements AppointmentController {
    private  appointmentService:  AppointmentService
    
    constructor ( appointmentService: AppointmentService ){
        this.appointmentService = appointmentService
    }
    public  async getAllAppointment(req: Request, res: Response): Promise<void> {
        try {
            const patients = await this.appointmentService.getAllAppointments()
            
            res.status(200).json(patients)
            
        } catch (error) {
            logger.error(error)
            res.status(400).json({message: "Error getting all appointments"})
        }
    }
    public  createAppointment (req: Request, res: Response): void {
        const appointmentReq = req.body
        this.appointmentService.createAppointment(appointmentReq)
        .then(
            (appointment) =>{
                res.status(201).json(appointment)
            },
            (error) =>{
                logger.error(error)
                if (error instanceof creationError){
                    res.status(400).json({
                        error_name: error.name,
                        message: "Failed Creating appointment"
                    })
                } else {
                    res.status(400).json({
                        message: "Internal Server Error"
                    })
                }
            }
        )

    }

    public async getAppointmentById (req: Request, res: Response): Promise<void> {
        try{

            const id = parseInt(req.params.id)
            if (isNaN(id)){
                throw new Error("Id must be a number") 
            }
            const appointment =  await this.appointmentService.getAppointmentById(id)
            if (appointment) {
                res.status(200).json(appointment)
            } else {
                throw new recordNotFoundError()
            }
        } catch (error) {
            logger.error(error)
            if (error instanceof recordNotFoundError){
                res.status(400).json({error: error.message})
            } else {
                res.status(400).json({error: "Failed to retrieve patient"})
            }
        }
    }


    public async updateAppointment (req: Request, res: Response): Promise<void> {
        try{ 
            const id = parseInt(req.params.id)
            const appointmentReq = req.body
            const cita =  await this.appointmentService.updateAppointment(id, appointmentReq)
            if (cita) {
                res.status(200).json(cita)
            } else {
                throw new updateError()
            }
        } catch (error) {
            logger.error(error)
            if (error instanceof recordNotFoundError){
                res.status(400).json({error: error.message})
            } else  if (error instanceof updateError){
                res.status(400).json({error: error.message})
            } else {
                res.status(400).json({error: "Failed to update patient"})
            }
        }
    }

    public async deleteAppointment (req: Request, res: Response): Promise<void> {
        try{
            const id = parseInt(req.params.id)
            await this.appointmentService.deleteAppointment(id)
            
            res.status(200).json({message: `Appointment was deleted successfully`})
        } catch (error) {
            logger.error(error)
            if (error instanceof deleteError){
                res.status(400).json({error: error.message})
            } else {
                res.status(400).json({error: "Failed to delete appointment"})
            }
        }
    }

}