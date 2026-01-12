import { api } from '@/config/api';

export async function uploadDoctorAvatar(doctorId: string, file: File, onProgress?: (percent: number) => void) {
  const fd = new FormData();
  fd.append('file', file);
  // Use XHR-based uploader to support progress events
  return api.uploadWithProgress<{ url: string; path: string }>(`/uploads/doctors/${doctorId}/avatar`, fd, onProgress);
}

export async function uploadHospitalLogo(hospitalId: string, file: File, onProgress?: (percent: number) => void) {
  const fd = new FormData();
  fd.append('file', file);
  return api.uploadWithProgress<{ url: string; path: string }>(`/uploads/hospitals/${hospitalId}/logo`, fd, onProgress);
}

export async function uploadHospitalImages(hospitalId: string, files: File[], onProgress?: (percent: number) => void) {
  const fd = new FormData();
  files.forEach((f) => fd.append('files', f));
  return api.uploadWithProgress<{ urls: string[] }>(`/uploads/hospitals/${hospitalId}/images`, fd, onProgress);
}

export async function uploadPatientAvatar(userId: string, file: File, onProgress?: (percent: number) => void) {
  const fd = new FormData();
  fd.append('file', file);
  return api.uploadWithProgress<{ url: string; path: string }>(`/uploads/patients/${userId}/avatar`, fd, onProgress);
}

export async function uploadGeneric(bucket: string, id: string, file: File, onProgress?: (percent: number) => void) {
  const fd = new FormData();
  fd.append('file', file);
  return api.uploadWithProgress<{ url: string; path: string }>(`/uploads/${bucket}/${id}`, fd, onProgress);
}

export const uploadApi = {
  uploadDoctorAvatar,
  uploadHospitalLogo,
  uploadHospitalImages,
  uploadPatientAvatar,
  uploadGeneric,
};
