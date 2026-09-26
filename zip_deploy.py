import os
import zipfile

def zipdir(path, ziph, root_dir_name=""):
    # ziph is zipfile handle
    for root, dirs, files in os.walk(path):
        # exclude node_modules, dist, .git
        dirs[:] = [d for d in dirs if d not in ('node_modules', 'dist', '.git', '.github')]
        for file in files:
            if file == 'deploy.zip' or file.endswith('.py') or file.endswith('.mjs'):
                continue
            
            file_path = os.path.join(root, file)
            rel_path = os.path.relpath(file_path, path)
            arcname = os.path.join(root_dir_name, rel_path) if root_dir_name else rel_path
            ziph.write(file_path, arcname)

if __name__ == '__main__':
    base_dir = r"d:\beliau\portofolio_diyul"
    
    with zipfile.ZipFile(os.path.join(base_dir, 'deploy.zip'), 'w', zipfile.ZIP_DEFLATED) as zipf:
        print("Zipping landing...")
        zipdir(os.path.join(base_dir, 'landing'), zipf, 'landing')
        
        print("Zipping portfolio-api as fortofolio_api...")
        zipdir(os.path.join(base_dir, 'portfolio-api'), zipf, 'fortofolio_api')
        
        print("Zipping portfolio-web as fortofolio_web...")
        zipdir(os.path.join(base_dir, 'portfolio-web'), zipf, 'fortofolio_web')

    print("deploy.zip created successfully.")
