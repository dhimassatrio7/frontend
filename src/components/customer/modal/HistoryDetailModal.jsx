
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from "@nextui-org/react";
import React, { useEffect, useState } from 'react';

const HistoryDetailModal = ({ isDetailModalOpen, setIsDetailModalOpen, historyModalIndex, serviceHistory, cancelledTransactions }) => {
  const [detailService, setDetailService] = useState({
    id: null,
    title: "",
    price: null,
    address: "",
    jobDetail: "",
    name: "",
    phone: null,
    status: "",
    date: ""
  });

  const setDetail = (cancelledTransactions) => {
    const service = cancelledTransactions.find(service => service.id === historyModalIndex);
    console.log('INI DIA :', service)
    if (service) {
      setDetailService({
        id: service.id,
        title: service.service.service_name,
        price: service.service.price,
        address: service.address || "", // Ambil alamat dari customer
        jobDetail: service.detail_order || "", // Ambil deskripsi pekerjaan
        name: service.customer[0]?.name || "", // Ambil nama dari customer
        phone: service.customer[0]?.contact || "", // Ambil kontak dari customer
        status: service.transaction_status,
        date: service.order_date
      });
    }
  };

  useEffect(() => {
    if (historyModalIndex !== null) {
      setDetail(serviceHistory);
    }
  }, [historyModalIndex, serviceHistory]);

  return (
    <Modal backdrop="blur" className="bg-white border border-[#003366] rounded-md" isOpen={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 font-bold text-2xl">Detail Layanan</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-3">
                <div>
                  <strong>Jasa :</strong>
                  <p>{detailService.title}</p>
                </div>
                <div>
                  <strong>Nama :</strong>
                  <p>{detailService.name}</p>
                </div>
                <div>
                  <strong>Tanggal :</strong>
                  <p>{new Date(detailService.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <strong>Harga :</strong>
                  <p>Rp. {new Intl.NumberFormat('id-ID').format(detailService.price)}</p>
                </div>
                <div>
                  <strong>Lokasi :</strong>
                  <p>{detailService.address}</p>
                </div>
                <div>
                  <strong>Deskripsi Pekerjaan :</strong>
                  <p>{detailService.jobDetail}</p>
                </div>
                <div>
                  <strong>Status :</strong>
                  <p>{detailService.status}</p>
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
  );
};

export default HistoryDetailModal;