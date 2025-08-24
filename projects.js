document.addEventListener('DOMContentLoaded', () => {
    fetch('projects.json')
        .then(response => response.json())
        .then(data => {
            const pathname = window.location.pathname;
            const isIndex = pathname.endsWith('/') || pathname.endsWith('index.html');
            const isProjectsPage = pathname.includes('projects.html');
            const isProjectPage = pathname.includes('project.html');
    
            // Index page: first 4 projects
            if (isIndex) {
                const container = document.getElementById('projects-container');
                data.slice(0, 4).forEach(project => renderProjectCard(project, container));
            } 
            // Projects page: all projects
            else if (isProjectsPage) {
                const container = document.getElementById('projects-container');
                data.forEach(project => renderProjectCard(project, container));
            } 
            // Individual project page
            else if (isProjectPage) {
                const params = new URLSearchParams(window.location.search);
                const projectId = parseInt(params.get('id'), 10);
                const project = data.find(p => p.id === projectId);
                if (!project) return;
    
                // Title, subtitle, body
                document.getElementById('project-title').textContent = project.title;
                document.getElementById('project-subtitle').textContent = project.subtitle;
                document.getElementById('project-body').textContent = project.body.replace(/<[^>]+>/g, '');
    
                // Bullets
                const bulletsEl = document.getElementById('project-bullets');
                project.bullets.forEach(b => {
                    const li = document.createElement('li');
                    li.textContent = b;
                    bulletsEl.appendChild(li);
                });
    
                // Gallery with modal
                const galleryEl = document.getElementById('project-gallery');
                if (galleryEl && project.images.length) {
                    project.images.forEach((src, index) => {
                        const div = document.createElement('div');
                        const img = document.createElement('img');
                        img.src = src;
                        img.alt = project.title;
                        img.dataset.caption = project.captions ? project.captions[index] : '';
                        div.appendChild(img);
                        galleryEl.appendChild(div);
                    });
    
                    const modal = document.getElementById('myModal');
                    const modalImg = document.getElementById('img01');
                    const captionText = document.getElementById('caption');
                    const closeBtn = modal.querySelector('.close');
    
                    // Open modal
                    galleryEl.querySelectorAll('img').forEach(img => {
                        img.addEventListener('click', () => {
                            modal.classList.add('show');  // use CSS show class
                            modalImg.src = img.src;
                            captionText.textContent = img.dataset.caption;
                        });
                    });
    
                    // Close modal
                    closeBtn.addEventListener('click', () => modal.classList.remove('show'));
                    modal.addEventListener('click', e => {
                        if (e.target === modal) modal.classList.remove('show');
                    });
                }
            }
        })
        .catch(error => console.error('Error loading projects:', error));
    
    // Helper to render a project card (for index and projects pages)
    function renderProjectCard(project, container) {
        const work = document.createElement('div');
        work.classList.add('work');
    
        const img = document.createElement('img');
        img.src = project.thumbnail;
        img.alt = project.title;
    
        const title = document.createElement('div');
        title.classList.add('project-title');
        title.textContent = project.title;
    
        const layer = document.createElement('div');
        layer.classList.add('layer');
    
        const h3 = document.createElement('h3');
        h3.textContent = project.subtitle || '';
    
        const p = document.createElement('p');
        p.textContent = (project.body || '').replace(/<[^>]+>/g, '');
    
        const link = document.createElement('a');
        link.href = `project.html?id=${encodeURIComponent(project.id)}`;
        link.textContent = 'View';
    
        layer.appendChild(h3);
        layer.appendChild(p);
        layer.appendChild(link);
    
        work.appendChild(img);
        work.appendChild(title);
        work.appendChild(layer);
    
        container.appendChild(work);
    }
});



