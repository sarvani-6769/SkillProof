import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import ProjectCard from '../components/ProjectCard';
import Modal from '../components/Modal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import ProofViewerModal from '../components/ProofViewerModal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Layers, Plus, Upload, Filter } from 'lucide-react';

const STATUS_FILTERS = ['All', 'Verified', 'Pending', 'Not Submitted', 'Rejected'];

const ProjectsPage = () => {
  const toast = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  // Add / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    projectDuration: '',
    projectRole: '',
    autoSubmit: false,
  });
  const [proofFile, setProofFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Submit Verification Modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [verificationProofFile, setVerificationProofFile] = useState(null);

  // Delete Dialog
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Proof Viewer
  const [proofViewer, setProofViewer] = useState({
    isOpen: false,
    proofUrl: '',
    title: '',
    itemType: 'Project',
    remarks: '',
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/projects');
      if (res.data.success) {
        setProjects(res.data.projects);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      technologies: '',
      githubUrl: '',
      liveUrl: '',
      projectDuration: '',
      projectRole: '',
      autoSubmit: false,
    });
    setProofFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies ? project.technologies.join(', ') : '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      projectDuration: project.projectDuration || '',
      projectRole: project.projectRole || '',
      autoSubmit: false,
    });
    setProofFile(null);
    setIsModalOpen(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Project title and description are required');
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('description', formData.description.trim());
      data.append('technologies', formData.technologies);
      data.append('githubUrl', formData.githubUrl.trim());
      data.append('liveUrl', formData.liveUrl.trim());
      data.append('projectDuration', formData.projectDuration.trim());
      data.append('projectRole', formData.projectRole.trim());
      data.append('autoSubmit', formData.autoSubmit);

      if (proofFile) {
        data.append('proof', proofFile);
      }

      if (editingProject) {
        const res = await api.put(`/projects/${editingProject._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data.success) {
          toast.success('Project updated successfully');
          fetchProjects();
          setIsModalOpen(false);
        }
      } else {
        const res = await api.post('/projects', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data.success) {
          toast.success(res.data.message || 'Project added successfully');
          fetchProjects();
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await api.delete(`/projects/${deleteId}`);
      if (res.data.success) {
        toast.success('Project deleted');
        fetchProjects();
        setIsDeleteOpen(false);
      }
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  const handleOpenSubmitModal = (project) => {
    setSelectedProject(project);
    setVerificationProofFile(null);
    setIsSubmitModalOpen(true);
  };

  const handleSubmitVerification = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const data = new FormData();
      if (verificationProofFile) {
        data.append('proof', verificationProofFile);
      }

      const res = await api.post(`/projects/${selectedProject._id}/submit`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        toast.success('Project submitted for verification!');
        fetchProjects();
        setIsSubmitModalOpen(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProjects =
    statusFilter === 'All'
      ? projects
      : projects.filter((p) => p.verificationStatus === statusFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Software Projects
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showcase your code repositories, architecture, and live applications
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              statusFilter === status
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {loading ? (
        <LoadingSpinner message="Loading your projects..." />
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onEdit={handleOpenEdit}
              onDelete={(id) => {
                setDeleteId(id);
                setIsDeleteOpen(true);
              }}
              onSubmitVerification={handleOpenSubmitModal}
              onViewProof={(url, title, type, remarks) =>
                setProofViewer({ isOpen: true, proofUrl: url, title, itemType: type, remarks })
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Layers}
          title={statusFilter === 'All' ? 'No Projects Added Yet' : `No ${statusFilter} Projects`}
          description="Add your personal or team projects with repo links and documentation."
          actionText="Add Project"
          onAction={handleOpenAdd}
        />
      )}

      {/* Add / Edit Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Add New Project'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveProject} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. SkillProof – Credential Verification Network"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Description *
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Key architecture, problems solved, and highlights..."
                required
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
              ></textarea>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Technologies Used (Comma-separated)
              </label>
              <input
                type="text"
                value={formData.technologies}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, technologies: e.target.value }))
                }
                placeholder="e.g. React, Node.js, Express, MongoDB, Tailwind CSS, Docker"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Your Role
              </label>
              <input
                type="text"
                value={formData.projectRole}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, projectRole: e.target.value }))
                }
                placeholder="e.g. Full-Stack Lead, Backend Developer"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Project Duration
              </label>
              <input
                type="text"
                value={formData.projectDuration}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, projectDuration: e.target.value }))
                }
                placeholder="e.g. 3 months, Spring 2025"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))
                }
                placeholder="https://github.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Live Demo URL
              </label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, liveUrl: e.target.value }))}
                placeholder="https://my-app.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Attach Supporting Document / Architecture Proof
              </label>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.svg,.webp"
                onChange={(e) => setProofFile(e.target.files[0])}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

            {!editingProject && (
              <div className="sm:col-span-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoSubmit}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, autoSubmit: e.target.checked }))
                    }
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-medium text-slate-700">
                    Immediately submit this project for official verification
                  </span>
                </label>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
            >
              {submitting ? 'Saving...' : editingProject ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Submit Verification Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit Project for Verification"
        description={`Submit "${selectedProject?.title}" for evaluation`}
      >
        <form onSubmit={handleSubmitVerification} className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Attach architectural diagrams, test reports, or verification documentation to validate your contribution.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Proof File (PDF or Image)
            </label>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.svg,.webp"
              onChange={(e) => setVerificationProofFile(e.target.files[0])}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
            >
              {submitting ? 'Submitting...' : 'Submit to Verifier'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        message="Are you sure you want to remove this project from your portfolio?"
        confirmText="Delete Project"
      />

      {/* Proof Viewer */}
      <ProofViewerModal
        isOpen={proofViewer.isOpen}
        onClose={() => setProofViewer((prev) => ({ ...prev, isOpen: false }))}
        proofUrl={proofViewer.proofUrl}
        title={proofViewer.title}
        itemType={proofViewer.itemType}
        remarks={proofViewer.remarks}
      />
    </div>
  );
};

export default ProjectsPage;
