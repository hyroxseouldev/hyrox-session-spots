"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  getAllHyroxBoxes,
  createHyroxBox,
  updateHyroxBox,
  deleteHyroxBox,
  HyroxBoxWithRegion,
} from "@/db/actions/hyroxbox";
import { getAllRegions } from "@/db/actions/region";
import { useRouter } from "next/navigation";

type Region = {
  id: number;
  name: string;
  code: string;
};

export default function HyroxBoxPage() {
  const router = useRouter();
  const [hyroxboxes, setHyroxboxes] = useState<HyroxBoxWithRegion[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBox, setSelectedBox] = useState<HyroxBoxWithRegion | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    contactInfo: "",
    instagramId: "",
    price: "",
    features: "",
    naverMapUrl: "",
    regionId: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [boxesData, regionsData] = await Promise.all([
        getAllHyroxBoxes(),
        getAllRegions(),
      ]);
      setHyroxboxes(boxesData);
      setRegions(regionsData);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedBox(null);
    setFormData({
      name: "",
      description: "",
      address: "",
      contactInfo: "",
      instagramId: "",
      price: "",
      features: "",
      naverMapUrl: "",
      regionId: "",
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleEdit = (box: HyroxBoxWithRegion) => {
    setSelectedBox(box);
    setFormData({
      name: box.name,
      description: box.description || "",
      address: box.address || "",
      contactInfo: box.contactInfo || "",
      instagramId: box.instagramId || "",
      price: box.price?.toString() || "",
      features: box.features || "",
      naverMapUrl: box.naverMapUrl || "",
      regionId: box.regionId.toString(),
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleDelete = (box: HyroxBoxWithRegion) => {
    setSelectedBox(box);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = {
        name: formData.name,
        description: formData.description || null,
        address: formData.address || null,
        contactInfo: formData.contactInfo || null,
        instagramId: formData.instagramId || null,
        price: formData.price ? parseInt(formData.price) : null,
        features: formData.features || null,
        naverMapUrl: formData.naverMapUrl || null,
        regionId: parseInt(formData.regionId),
      };

      if (selectedBox) {
        await updateHyroxBox(selectedBox.id, data);
      } else {
        await createHyroxBox(data);
      }
      setIsModalOpen(false);
      await loadData();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "작업 실패");
    }
  };

  const confirmDelete = async () => {
    if (!selectedBox) return;

    try {
      await deleteHyroxBox(selectedBox.id);
      await loadData();
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "삭제 실패");
    }
  };

  const filteredBoxes = hyroxboxes.filter(
    (box) =>
      box.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      box.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      box.region?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: "ID", accessor: "id" as keyof HyroxBoxWithRegion },
    { header: "이름", accessor: "name" as keyof HyroxBoxWithRegion },
    {
      header: "지역",
      accessor: (row: HyroxBoxWithRegion) => row.region?.name || "-",
    },
    {
      header: "주소",
      accessor: (row: HyroxBoxWithRegion) => (
        <span className="line-clamp-1">{row.address || "-"}</span>
      ),
    },
    {
      header: "가격",
      accessor: (row: HyroxBoxWithRegion) =>
        row.price ? `${row.price.toLocaleString()}원` : "-",
    },
    {
      header: "생성일",
      accessor: (row: HyroxBoxWithRegion) =>
        new Date(row.createdAt).toLocaleDateString("ko-KR"),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            HyroxBox 관리
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            HyroxBox 정보를 관리합니다
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          <Plus className="h-4 w-4" />
          새 박스 추가
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="이름, 주소, 지역으로 검색..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500">로딩 중...</div>
        ) : (
          <DataTable
            data={filteredBoxes}
            columns={columns}
            actions={(box) => (
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => handleEdit(box)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(box)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          />
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedBox ? "박스 수정" : "새 박스 추가"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                이름 *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                지역 *
              </label>
              <select
                required
                value={formData.regionId}
                onChange={(e) =>
                  setFormData({ ...formData, regionId: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">선택하세요</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              설명
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              주소
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                연락처
              </label>
              <input
                type="text"
                value={formData.contactInfo}
                onChange={(e) =>
                  setFormData({ ...formData, contactInfo: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                인스타그램 ID
              </label>
              <input
                type="text"
                value={formData.instagramId}
                onChange={(e) =>
                  setFormData({ ...formData, instagramId: e.target.value })
                }
                placeholder="@없이 입력"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                가격 (원)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                특징 (쉼표로 구분)
              </label>
              <input
                type="text"
                value={formData.features}
                onChange={(e) =>
                  setFormData({ ...formData, features: e.target.value })
                }
                placeholder="피트니스, 요가, 크로스핏"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              네이버 지도 URL
            </label>
            <input
              type="url"
              value={formData.naverMapUrl}
              onChange={(e) =>
                setFormData({ ...formData, naverMapUrl: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              {selectedBox ? "수정" : "추가"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="박스 삭제"
        message={`"${selectedBox?.name}" 박스를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmText="삭제"
        cancelText="취소"
        variant="danger"
      />
    </div>
  );
}
