import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from "@nextui-org/react";
import React from 'react'

const HistoryDetailModal = ({isDetailModalOpen, setIsDetailModalOpen, detailModalIndex, filteredTransactions, orders}) => {
  
  return (
    <Modal backdrop="blur" className="bg-white border border-[#003366] rounded-md" isOpen={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 font-bold text-2xl">Rincian Jasa</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-3">
                  <div>
                    <strong>Jasa :</strong>
                    <p>{filteredTransactions[detailModalIndex].service.service_name}</p>
                  </div>
                  <div>
                    <strong>Tanggal Pesanan:</strong>
                    <p>{new Date(filteredTransactions[detailModalIndex].createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <strong>Tanggal Selesai:</strong>
                    <p>{new Date(filteredTransactions[detailModalIndex].updatedAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <strong>Harga :</strong>
                    <p>Rp. {new Intl.NumberFormat('id-ID').format(filteredTransactions[detailModalIndex].service.price)}</p>
                  </div>
                  <div>
                    <strong>Alamat :</strong>
                    <p>{filteredTransactions[detailModalIndex].address}</p>
                  </div>
                  <div>
                    <strong>Deskripsi Pekerjaan :</strong>
                    <p>{filteredTransactions[detailModalIndex].detail_order} </p>
                  </div>
                  <div>
                    <strong>Status :</strong>
                    <p>{filteredTransactions[detailModalIndex].transaction_status}</p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button className="bg-[#003366] rounded-md font-semibold text-white" variant="light" onPress={onClose}>
                  Tutup
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
  )
}

export default HistoryDetailModal